import { useCallback, useState } from "react";
import { Address, erc20Abi as ERC20_ABI, parseUnits } from "viem";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";

import { config } from "@/providers/wagmi/config";
import addressDriver from "@/types/contracts/address-driver";
import nftDriver from "@/types/contracts/nft-driver";

const NFT_DRIVER_ADDRESS = nftDriver.address;
const ADDRESS_DRIVER_ADDRESS = addressDriver.address;

const NFT_DRIVER_ABI = nftDriver.abi;
const ADDRESS_DRIVER_ABI = addressDriver.abi;

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

function useStreamSetup(ERC20_TOKEN_ADDRESS?: Address) {
  const { address } = useAccount();
  const [allocation, setAllocation] = useState("");
  const [duration, setDuration] = useState("");
  const [isApprovalProcessing, setIsApprovalProcessing] = useState(false);
  const [isMintProcessing, setIsMintProcessing] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState<Address>();
  const [tokenId, setTokenId] = useState<bigint | null>(null);

  const { data: currentAllowance } = useReadContract({
    address: ERC20_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: [address!, NFT_DRIVER_ADDRESS],
    query: {
      enabled: !!address && !!ERC20_TOKEN_ADDRESS,
    },
  });

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

  const { writeContract: writeNFTContract, isPending: isMinting } =
    useWriteContract();

  const { writeContract: writeApproveContract, isPending: isApproving } =
    useWriteContract();

  const { writeContract: writeSetStreamContract, isPending: isSettingStream } =
    useWriteContract();

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

  const handleCreateFundingFlow = async () => {
    if (!ERC20_TOKEN_ADDRESS) throw new Error("Token to send wasn't selected");
    if (!address) throw new Error("Wallet not connected");

    const allocationBigInt = parseUnits(allocation, 18);

    const mintNFT = async (): Promise<bigint> => {
      if (tokenId) return tokenId;

      return new Promise((resolve, reject) => {
        writeNFTContract(
          {
            address: NFT_DRIVER_ADDRESS,
            abi: NFT_DRIVER_ABI,
            functionName: "mint",
            args: [address, []],
          },
          {
            onSuccess: async (hash) => {
              console.log("Mint transaction hash:", hash);
              try {
                setIsMintProcessing(true);
                const receipt = await waitForTransactionReceipt(config, {
                  hash,
                });
                if (receipt.status !== "success") {
                  throw new Error("Minting failed");
                }
                const mintEvent = receipt.logs.find(
                  (log) =>
                    log.address.toLowerCase() ===
                      NFT_DRIVER_ADDRESS.toLowerCase() &&
                    log.topics[0] ===
                      "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                );
                if (mintEvent && mintEvent.topics[3]) {
                  const newTokenId = BigInt(mintEvent.topics[3]);
                  setTokenId(newTokenId);
                  resolve(newTokenId);
                } else {
                  reject(
                    new Error("Failed to extract tokenId from mint event"),
                  );
                }
              } catch (error) {
                reject(error);
              } finally {
                setIsMintProcessing(false);
              }
            },
            onError: reject,
          },
        );
      });
    };

    const approveTokens = async () => {
      if (currentAllowance || 0 >= allocationBigInt) return;
      return new Promise((resolve, reject) => {
        writeApproveContract(
          {
            address: ERC20_TOKEN_ADDRESS,
            abi: ERC20_ABI,
            functionName: "approve",
            args: [NFT_DRIVER_ADDRESS, allocationBigInt],
          },
          {
            onSuccess: async (hash) => {
              console.log("Approve transaction hash:", hash);
              try {
                setIsApprovalProcessing(true);
                const receipt = await waitForTransactionReceipt(config, {
                  hash,
                });
                if (receipt.status !== "success") {
                  throw new Error("Token approval failed");
                }
                resolve(receipt);
              } catch (error) {
                console.error("Error waiting for approval transaction:", error);
                reject(error);
              } finally {
                setIsApprovalProcessing(false);
              }
            },
            onError: (error) => {
              console.error("Error in approval transaction:", error);
              reject(error);
            },
          },
        );
      });
    };

    const setUpStream = async (tokenId: bigint) => {
      const streamParams = calculateStreamParams();
      if (!streamParams) throw new Error("Invalid stream parameters");
      return new Promise((resolve, reject) => {
        writeSetStreamContract(
          {
            address: NFT_DRIVER_ADDRESS,
            abi: NFT_DRIVER_ABI,
            functionName: "setStreams",
            args: [
              tokenId,
              ERC20_TOKEN_ADDRESS,
              [],
              streamParams.balanceDelta,
              [
                {
                  accountId: streamParams.accountId,
                  config: streamParams.config,
                },
              ],
              BigInt(0),
              address,
            ],
          },
          {
            onSuccess: resolve,
            onError: reject,
          },
        );
      });
    };

    try {
      const nftTokenId = await mintNFT();
      await approveTokens();
      await setUpStream(nftTokenId);
      console.log("Funding flow created successfully");
    } catch (error) {
      console.error("Error in creating funding flow:", error);
      throw error;
    }
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
    handleCreateFundingFlow,
    isMinting,
    isMintProcessing,
    isApproving,
    isApprovalProcessing,
    isSettingStream,
  };
}

export default useStreamSetup;
