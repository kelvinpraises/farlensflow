"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/atoms/alert";
import { Button } from "@/components/atoms/button";
import Card from "@/components/atoms/card";
import Emoji from "@/components/atoms/emoji";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { Funding, FundRecipient } from "@/types";
import { cn } from "@/utils";

const FundingHead = ({ item }: { item: Funding }) => {
  const { status, name, emojiCodePoint, token } = item;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "text-green-800";
      case "Voting":
        return "text-blue-800";
      case "Passed":
        return "text-purple-800";
      case "Closed":
        return "text-red-800";
      default:
        return "text-gray-800";
    }
  };

  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex items-center gap-4">
        <Emoji
          emoji={emojiCodePoint}
          className="inline-block text-4xl !no-underline"
        />
        <div className="flex flex-col items-start">
          <h3 className="text-lg w-fit font-semibold text-gray-800">{name}</h3>
          <div className="flex gap-4">
            <span className={cn("text-sm", getStatusColor(status))}>
              {status}
            </span>
            <span className="text-sm text-gray-600">
              Fund appeal: {token.symbol}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const FundingBody = ({ item }: { item: Funding }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recipients, setRecipients] = useState<FundRecipient[]>([]);
  const [originalRecipients, setOriginalRecipients] = useState<FundRecipient[]>(
    [],
  );
  const [votingEnded, setVotingEnded] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const fetchRecipients = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Assuming the API returns the recipients for this specific fund
        const fetchedRecipients = item.recipients || [];
        setRecipients(fetchedRecipients);
        setOriginalRecipients(fetchedRecipients);
      } catch (error) {
        console.error("Failed to fetch recipients:", error);
        toast.error("Failed to load recipients. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipients();
  }, [item.id]); // Assuming item has an id field

  const handleAddDemoRecipients = async () => {
    setIsSubmitting(true);
    try {
      const demoRecipients: FundRecipient[] = [
        { address: "0x123...", name: "Recipient 1", status: "None" },
        { address: "0x456...", name: "Recipient 2", status: "None" },
      ];
      setRecipients((prevRecipients) => [...prevRecipients, ...demoRecipients]);
      setOriginalRecipients((prevRecipients) => [
        ...prevRecipients,
        ...demoRecipients,
      ]);
      toast.success("Demo recipients added successfully!");
    } catch (error) {
      toast.error("Failed to add demo recipients");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = (
    address: string,
    newStatus: FundRecipient["status"],
  ) => {
    setRecipients((prevRecipients) =>
      prevRecipients.map((recipient) =>
        recipient.address === address
          ? { ...recipient, status: newStatus }
          : recipient,
      ),
    );
  };

  useEffect(() => {
    const hasChanges =
      JSON.stringify(recipients) !== JSON.stringify(originalRecipients);
    setHasChanges(hasChanges);
  }, [recipients, originalRecipients]);

  const handleVote = (accept: boolean) => {
    toast.success(`Voted to ${accept ? "accept" : "reject"} funding`);
  };

  const handleSaveUpdates = async () => {
    setIsSubmitting(true);
    try {
      // Simulating a transaction call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setOriginalRecipients(recipients);
      setHasChanges(false);
      toast.success("Recipient updates saved successfully!");
    } catch (error) {
      toast.error("Failed to save recipient updates");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        Loading recipients...
      </div>
    );
  }

  if (votingEnded) {
    return (
      <div className="flex flex-col gap-4">
        <Alert>
          <AlertDescription>
            Voting time has ended. Please cast your vote.
          </AlertDescription>
        </Alert>
        <div className="flex gap-4">
          <Button onClick={() => handleVote(true)} className="flex-1">
            Accept Funding
          </Button>
          <Button onClick={() => handleVote(false)} className="flex-1">
            Reject Funding
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {recipients.length === 0 ? (
        <Button
          onClick={handleAddDemoRecipients}
          disabled={isSubmitting}
          className="w-full bg-zinc-800 text-white hover:bg-zinc-700 rounded-lg py-3"
        >
          {isSubmitting ? "Adding..." : "Add Demo Recipients"}
        </Button>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recipients.map((recipient) => (
              <Card key={recipient.address} className="p-4 flex">
                <div className="flex items-center gap-4">
                  <Emoji
                    emoji="1F9D1 200D 1F91D 200D 1F9D1"
                    className="text-3xl"
                  />
                  <div>
                    <p className="font-semibold">{recipient.name}</p>
                    <p className="text-sm text-gray-600">
                      {recipient.address.slice(0, 6)}...
                      {recipient.address.slice(-4)}
                    </p>
                  </div>
                </div>
                <Select
                  value={recipient.status}
                  onValueChange={(value) =>
                    handleStatusChange(
                      recipient.address,
                      value as FundRecipient["status"],
                    )
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Accepted">Accepted</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="Appealed">Appealed</SelectItem>
                    <SelectItem value="InReview">In Review</SelectItem>
                  </SelectContent>
                </Select>
              </Card>
            ))}
          </div>
          <Button
            onClick={handleSaveUpdates}
            disabled={isSubmitting || !hasChanges}
            className="w-full bg-zinc-800 text-white hover:bg-zinc-700 rounded-lg py-3 mt-4"
          >
            {isSubmitting ? "Saving..." : "Save Recipient Updates"}
          </Button>
        </>
      )}
    </div>
  );
};

export { FundingBody, FundingHead };
