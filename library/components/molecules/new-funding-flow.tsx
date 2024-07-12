"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { useFundingFlows } from "@/hooks/use-funding-flows";
import useStreamSetup from "@/hooks/use-stream-setup";

import { Button } from "@/components/atoms/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/atoms/dialog";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import EmojiPicker from "@/components/molecules/emoji-picker";
import TokenSelect from "@/components/molecules/token-select";
import { useAlchemy } from "@/hooks/use-alchemy";
import { Token } from "@/types";

type TimeUnit = "minutes" | "hours" | "days" | "weeks";

interface NewFundingFlowProps {
  username: string;
  address: string;
}

const NewFundingFlow = ({
  username,
  address: _recipientAddress,
}: NewFundingFlowProps) => {
  const { flow: conversationId } = useParams();

  const [emoji, setEmoji] = useState<string>("");
  const [token, setToken] = useState<Token | null>(null);
  const [description, setDescription] = useState("");
  const [durationValue, setDurationValue] = useState(1);
  const [durationUnit, setDurationUnit] = useState<TimeUnit>("hours");

  const { tokensQuery } = useAlchemy();
  const {
    address,
    allocation,
    setAllocation,
    duration,
    setDuration,
    recipientAddress,
    setRecipientAddress,
    handleCreateFundingFlow,
    isMinting,
    isMintProcessing,
    isApproving,
    isSettingStream,
  } = useStreamSetup(token?.address);
  const { saveFundingFlow } = useFundingFlows(conversationId as string);

  useEffect(() => {
    // setRecipientAddress(_recipientAddress);
    setRecipientAddress("0xFAbCB60b5E25e5B09087BBec88C2f79ABC42979C");
  }, [_recipientAddress, setRecipientAddress]);

  useEffect(() => {
    const durationMs = getMilliseconds(durationValue, durationUnit);
    setDuration(Math.floor(durationMs / 1000).toString());
  }, [durationUnit, durationValue, setDuration]);

  const emojiPickerContainerRef = useRef<HTMLDivElement>(null);

  const timeUnits: TimeUnit[] = ["minutes", "hours", "days", "weeks"];

  const getMilliseconds = (value: number, unit: TimeUnit) => {
    const multipliers = {
      minutes: 60 * 1000,
      hours: 60 * 60 * 1000,
      days: 24 * 60 * 60 * 1000,
      weeks: 7 * 24 * 60 * 60 * 1000,
    };
    return value * multipliers[unit];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address) {
      toast.error("Please connect your wallet first.");
      return;
    }

    if (!recipientAddress || !token || !allocation || !duration) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      await handleCreateFundingFlow();

      saveFundingFlow({
        address,
        emojiCodePoint: emoji,
        token,
        description,
        duration,
        allocation,
        recipientAddress,
        createdAt: new Date().toISOString(),
      });

      toast.success("Funding flow created successfully!");
    } catch (error) {
      console.error("Error creating funding flow:", error);
      toast.error(
        `Failed to create funding flow: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full bg-zinc-800 text-white hover:bg-zinc-700 rounded-lg py-3"
        >
          New Funding Flow to @{username}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white sm:rounded-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle>Create a Funding Flow</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div ref={emojiPickerContainerRef} className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label>General</Label>
              <div className="flex space-x-2 items-center">
                <EmojiPicker
                  emojiPickerContainerRef={emojiPickerContainerRef}
                  setSelectedEmoji={setEmoji}
                />
                <Input
                  type="text"
                  value={recipientAddress}
                  readOnly
                  placeholder="Recipient Address"
                />
              </div>
              <div className="flex space-x-2">
                <TokenSelect
                  tokens={
                    tokensQuery.data || [
                      {
                        address: "0x23dB4a08f2272df049a4932a4Cc3A6Dc1002B33E",
                        symbol: "TT",
                        name: "Test Token",
                      },
                    ]
                  }
                  selectedToken={token}
                  onSelectToken={setToken}
                />
                <Input
                  type="number"
                  min="1"
                  value={allocation}
                  onChange={(e) => setAllocation(e.target.value)}
                  placeholder="Amount"
                />
              </div>
              <Input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optional)"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Flow Duration</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  min="1"
                  value={durationValue}
                  onChange={(e) => setDurationValue(parseInt(e.target.value))}
                  className="w-20"
                />
                <Select
                  value={durationUnit}
                  onValueChange={(value: TimeUnit) => setDurationUnit(value)}
                >
                  <SelectTrigger className="w-[110px]">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectGroup>
                      {timeUnits.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <span>from now it ends</span>
              </div>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-zinc-800 text-white hover:bg-zinc-700 rounded-lg py-3"
            disabled={
              isMinting || isMintProcessing || isApproving || isSettingStream
            }
          >
            {isMinting || isMintProcessing
              ? "Minting Account..."
              : isApproving
                ? "Approving Token..."
                : isSettingStream
                  ? "Setting Stream..."
                  : "Create Funding Flow"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewFundingFlow;
