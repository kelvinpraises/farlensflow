import { useCallback, useState, useEffect } from "react";
import { Address } from "viem";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import addressDriver from "@/types/contracts/address-driver";
import drips from "@/types/contracts/drips";

const DRIPS_ADDRESS = drips.address;
const ADDRESS_DRIVER_ADDRESS = addressDriver.address;

const DRIPS_ABI = drips.abi;
const ADDRESS_DRIVER_ABI = addressDriver.abi;

const MAX_CYCLES = 1000; // Adjust as needed

export function useDripsManagement(erc20TokenAddress: Address) {
  const { address } = useAccount();
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiveStreamsTxHash, setReceiveStreamsTxHash] = useState<
    `0x${string}` | null
  >(null);
  const [splitTxHash, setSplitTxHash] = useState<`0x${string}` | null>(null);
  const [collectTxHash, setCollectTxHash] = useState<`0x${string}` | null>(
    null,
  );

  const { data: accountId } = useReadContract({
    address: ADDRESS_DRIVER_ADDRESS,
    abi: ADDRESS_DRIVER_ABI,
    functionName: "calcAccountId",
    args: [address as `0x${string}`],
    query: {
      enabled: !!address,
    },
  });

  console.log("accountId: ", address);

  const { data: cycles } = useReadContract({
    address: DRIPS_ADDRESS,
    abi: DRIPS_ABI,
    functionName: "receivableStreamsCycles",
    args: [accountId || BigInt(0), erc20TokenAddress],
    query: {
      enabled: !!accountId,
    },
  });

  const { data: splittableAmount } = useReadContract({
    address: DRIPS_ADDRESS,
    abi: DRIPS_ABI,
    functionName: "splittable",
    args: [accountId || BigInt(0), erc20TokenAddress],
    query: {
      enabled: !!accountId,
    },
  });

  const { data: collectableAmount } = useReadContract({
    address: DRIPS_ADDRESS,
    abi: DRIPS_ABI,
    functionName: "collectable",
    args: [accountId || BigInt(0), erc20TokenAddress],
    query: {
      enabled: !!accountId,
    },
  });

  const { writeContract: writeReceiveStreams } = useWriteContract();
  const { writeContract: writeSplit } = useWriteContract();
  const { writeContract: writeCollect } = useWriteContract();

  const { isLoading: isReceiveStreamsProcessing } =
    useWaitForTransactionReceipt({
      hash: receiveStreamsTxHash!,
      query: { enabled: !!receiveStreamsTxHash },
    });

  const { isLoading: isSplitProcessing } = useWaitForTransactionReceipt({
    hash: splitTxHash!,
    query: { enabled: !!splitTxHash },
  });

  const { isLoading: isCollectProcessing } = useWaitForTransactionReceipt({
    hash: collectTxHash!,
    query: { enabled: !!collectTxHash },
  });

  const handleReceiveAndCollect = useCallback(async () => {
    if (!accountId || !address) return;
    setIsProcessing(true);

    try {
      // Step 1: Receive streams
      if (cycles && cycles > 0) {
        writeReceiveStreams(
          {
            address: DRIPS_ADDRESS,
            abi: DRIPS_ABI,
            functionName: "receiveStreams",
            args: [
              accountId,
              erc20TokenAddress,
              Math.min(Number(cycles), MAX_CYCLES),
            ],
          },
          {
            onSuccess: (hash) => {
              console.log("Receive streams transaction hash:", hash);
              setReceiveStreamsTxHash(hash);
            },
            onError: (error) => {
              console.error("Error receiving streams:", error);
            },
          },
        );
      }

      // Step 2: Split if necessary
      if (splittableAmount && splittableAmount > BigInt(0)) {
        writeSplit(
          {
            address: DRIPS_ADDRESS,
            abi: DRIPS_ABI,
            functionName: "split",
            args: [accountId, erc20TokenAddress, []],
          },
          {
            onSuccess: (hash) => {
              console.log("Split transaction hash:", hash);
              setSplitTxHash(hash);
            },
            onError: (error) => {
              console.error("Error splitting:", error);
            },
          },
        );
      }

      // Step 3: Collect
      if (collectableAmount && collectableAmount > BigInt(0)) {
        writeCollect(
          {
            address: ADDRESS_DRIVER_ADDRESS,
            abi: ADDRESS_DRIVER_ABI,
            functionName: "collect",
            args: [erc20TokenAddress, address],
          },
          {
            onSuccess: (hash) => {
              console.log("Collect transaction hash:", hash);
              setCollectTxHash(hash);
            },
            onError: (error) => {
              console.error("Error collecting:", error);
            },
          },
        );
      }
    } catch (error) {
      console.error("Error managing drips:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [
    accountId,
    address,
    cycles,
    splittableAmount,
    collectableAmount,
    erc20TokenAddress,
    writeReceiveStreams,
    writeSplit,
    writeCollect,
  ]);

  const isAnyTxProcessing =
    isReceiveStreamsProcessing || isSplitProcessing || isCollectProcessing;

  return {
    accountId,
    cycles,
    splittableAmount,
    collectableAmount,
    handleReceiveAndCollect,
    isProcessing: isProcessing || isAnyTxProcessing,
  };
}
