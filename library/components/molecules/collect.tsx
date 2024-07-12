"use client";

import Image from "next/image";
import { formatEther } from "viem";

import { Alert, AlertDescription } from "@/components/atoms/alert";
import { Button } from "@/components/atoms/button";
import { Separator } from "@/components/atoms/separator";
import { useDripsManagement } from "@/hooks/use-drips-management";
import { cn } from "@/utils";
import { FundingFlowState, Token } from "@/types";

const CollectHead = (collect: { token: Token }) => {
  const { optimalReceivableAmount, splittableAmount, collectableAmount } =
    useDripsManagement(collect.token.address);

  const totalReceivableAmount =
    (optimalReceivableAmount || BigInt(0)) +
    (splittableAmount || BigInt(0)) +
    (collectableAmount || BigInt(0));

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-4 items-center">
        <div className="relative w-fit">
          <Image
            src={`https://avatar.vercel.sh/${collect.token.address}`}
            alt={`${collect.token.symbol} logo`}
            width={48}
            height={48}
            className="aspect-[1] rounded-full h-fit w-fit object-cover"
          />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">
          {collect.token.address}
        </h3>
      </div>
      <div className="flex gap-2 p-1 rounded-lg text-gray-700">
        <p className="text-sm w-fit">
          Total Receivable: {formatEther(totalReceivableAmount)} ETH
        </p>
      </div>
    </div>
  );
};

const CollectBody = (collect: {
  token: Token;
  fundingFlows: FundingFlowState[];
}) => {
  const {
    optimalReceivableAmount,
    splittableAmount,
    collectableAmount,
    handleReceiveAndCollect,
    isReceiving,
    isReceiveStreamsProcessing,
    isSpliting,
    isSplitProcessing,
    isCollecting,
    isCollectProcessing,
  } = useDripsManagement(collect.token.address);

  const totalReceivableAmount =
    (optimalReceivableAmount || BigInt(0)) +
    (splittableAmount || BigInt(0)) +
    (collectableAmount || BigInt(0));

  return (
    <div className="flex flex-col gap-4">
      <Alert variant="destructive">
        <AlertDescription></AlertDescription>
      </Alert>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-2 text-gray-700 text-base font-semibold w-full">
          <div className="flex flex-col">
            <p>
              Receivable Amount:{" "}
              {optimalReceivableAmount
                ? formatEther(optimalReceivableAmount)
                : "0"}{" "}
              ETH
            </p>
            <p>
              Splittable Amount:{" "}
              {splittableAmount ? formatEther(splittableAmount) : "0"} ETH
            </p>
            <p>
              Collectable Amount:{" "}
              {collectableAmount ? formatEther(collectableAmount) : "0"} ETH
            </p>
          </div>

          <p className="text-gray-500 font-bold text-xs">
            Total Receivable: {formatEther(totalReceivableAmount)} ETH
          </p>
        </div>
        <div className="flex w-full gap-2 items-center">
          <Separator
            className=" bg-slate-200 hidden sm:block"
            orientation="vertical"
          />
          <Button
            className={cn("bg-zinc-800 text-white hover:bg-zinc-700 w-full")}
            onClick={handleReceiveAndCollect}
            disabled={
              isReceiving ||
              isReceiveStreamsProcessing ||
              isSpliting ||
              isSplitProcessing ||
              isCollecting ||
              isCollectProcessing ||
              totalReceivableAmount <= BigInt(0)
            }
          >
            {isReceiving || isReceiveStreamsProcessing
              ? "Processing Streams..."
              : isSpliting || isSplitProcessing
                ? "Splitting Funds..."
                : isCollecting || isCollectProcessing
                  ? "Collecting..."
                  : "Collect Funds"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export { CollectBody, CollectHead };
