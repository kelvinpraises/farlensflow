import { useCallback, useState } from "react";
import { Address, parseUnits } from "viem";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

import addressDriver from "@/types/contracts/address-driver";
import nftDriver from "@/types/contracts/nft-driver";

const NFT_DRIVER_ADDRESS = nftDriver.address;
const ADDRESS_DRIVER_ADDRESS = addressDriver.address;

const NFT_DRIVER_ABI = nftDriver.abi;
const ADDRESS_DRIVER_ABI = addressDriver.abi;
const ERC20_ABI = [
  {
    type: "function",
    name: "approve",
    inputs: [
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
  },
] as const;

type StreamConfig = bigint;

const AMT_PER_SEC_MULTIPLIER: bigint = BigInt(1_000_000_000);

function calculateAmtPerSec(allocation: bigint, duration: bigint): bigint {
  return (allocation * AMT_PER_SEC_MULTIPLIER) / duration;
}

function createStreamConfig(
  streamId: number,
  amtPerSec: bigint,
  start: number,
  duration: number,
): StreamConfig {
  let config = BigInt(streamId);
  config = (config << BigInt(160)) | amtPerSec;
  config = (config << BigInt(32)) | BigInt(start);
  config = (config << BigInt(32)) | BigInt(duration);
  return config;
}

function useStreamSetup(ERC20_TOKEN_ADDRESS: Address) {
  const { address } = useAccount();
  const [allocation, setAllocation] = useState("");
  const [duration, setDuration] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [tokenId, setTokenId] = useState<bigint | null>(null);
  const [mintTxHash, setMintTxHash] = useState<`0x${string}` | null>(null);

  const { writeContract: writeNFTContract, isPending: isMinting } =
    useWriteContract();

  const handleMintNFT = async () => {
    if (!address) return;

    writeNFTContract(
      {
        address: NFT_DRIVER_ADDRESS,
        abi: NFT_DRIVER_ABI,
        functionName: "mint",
        args: [address, []],
      },
      {
        onSuccess: (hash) => {
          console.log("Transaction hash:", hash);
          setMintTxHash(hash);
          setTokenId(null);
        },
        onError: (error) => {
          console.error("Error:", error);
        },
      },
    );
  };

  const { data: mintTransactionReceipt, isLoading: isMintProcessing } =
    useWaitForTransactionReceipt({
      hash: mintTxHash!,
      query: {
        enabled: !!mintTxHash,
      },
    });

  // Update tokenId when mint transaction is confirmed
  if (mintTransactionReceipt && mintTransactionReceipt.status === "success") {
    // Extract tokenId from transaction receipt logs
    const mintEvent = mintTransactionReceipt.logs.find(
      (log) =>
        log.address.toLowerCase() === NFT_DRIVER_ADDRESS.toLowerCase() &&
        log.topics[0] ===
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", // Transfer event topic
    );
    if (mintEvent && mintEvent.topics[3] && !tokenId) {
      const newTokenId = BigInt(mintEvent.topics[3]);
      setTokenId(newTokenId);
    }
  }

  const { writeContract: writeApproveContract, isPending: isApproving } =
    useWriteContract();

  const handleApproveToken = async () => {
    if (!ERC20_TOKEN_ADDRESS) throw new Error("Token to send wasn't selected");
    if (!allocation) return;
    const allocationBigInt = parseUnits(allocation, 18); // TODO: might not be 18 decimals

    writeApproveContract(
      {
        address: ERC20_TOKEN_ADDRESS,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [NFT_DRIVER_ADDRESS, allocationBigInt],
      },
      {
        onSuccess: (hash) => {
          console.log("Approval transaction hash:", hash);
        },
        onError: (error) => {
          console.error("Approval error:", error);
        },
      },
    );
  };

  const { data: recipientAccountId } = useReadContract({
    address: ADDRESS_DRIVER_ADDRESS,
    abi: ADDRESS_DRIVER_ABI,
    functionName: "calcAccountId",
    args: [recipientAddress as `0x${string}`],
    query: {
      enabled:
        !!recipientAddress && /^0x[a-fA-F0-9]{40}$/.test(recipientAddress),
    },
  });

  const calculateStreamParams = useCallback(() => {
    if (!allocation || !duration || !recipientAccountId) return null;

    const allocationBigInt = parseUnits(allocation, 18);
    const durationBigInt = BigInt(parseInt(duration));
    const amtPerSec = calculateAmtPerSec(allocationBigInt, durationBigInt);
    const streamConfig = createStreamConfig(
      0,
      amtPerSec,
      0,
      parseInt(duration),
    );

    return {
      accountId: BigInt(recipientAccountId),
      config: streamConfig,
      balanceDelta: allocationBigInt,
    };
  }, [allocation, duration, recipientAccountId]);

  const { writeContract: writeSetStreamContract, isPending: isSettingStream } =
    useWriteContract();

  const handleSetStream = async () => {
    if (!ERC20_TOKEN_ADDRESS) throw new Error("Token to send wasn't selected");
    if (!tokenId || !address) return;
    const streamParams = calculateStreamParams();
    if (!streamParams) return;

    console.log(streamParams.accountId);

    writeSetStreamContract({
      address: NFT_DRIVER_ADDRESS,
      abi: NFT_DRIVER_ABI,
      functionName: "setStreams",
      args: [
        tokenId,
        ERC20_TOKEN_ADDRESS,
        [],
        streamParams.balanceDelta,
        [{ accountId: streamParams.accountId, config: streamParams.config }],
        BigInt(0),
        address,
      ],
    });
  };

  return {
    address,
    allocation,
    setAllocation,
    duration,
    setDuration,
    recipientAddress,
    setRecipientAddress,
    tokenId,
    handleMintNFT,
    handleApproveToken,
    handleSetStream,
    isMinting,
    isMintProcessing,
    isApproving,
    isSettingStream,
  };
}

export default useStreamSetup;
