"use client";

import React, { useState } from "react";
import { toast } from "sonner";

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
import { Textarea } from "@/components/atoms/text-area";
import { useIndexNetwork } from "@/hooks/use-index-network";
import { promptTemplate } from "@/utils/ai";

const NewFlow = () => {
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [interest, setInterest] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const { createConversation, addMessage, conversationsQuery } =
    useIndexNetwork();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!name || !interest || !description) {
      toast.error("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await createConversation.mutateAsync({
        summary: JSON.stringify({
          name,
          logoUrl,
          description,
          app: "farlensflow",
        }),
        sources: [
          "did:pkh:eip155:1:0x524C889CE68dcaF3830694415EdE91508681D104",
        ],
        members: [
          "did:key:z6MkmvBmZitP8GKFrscX1PgpGA7X5Mw3nX1EWcC2Xrx4FST8",
          "did:key:z6MkmFfvAAMgh2zd6kscS73b6yyJFDNRr8h4EU7AhWnQtcXc",
        ],
      });

      toast.success("Details sent. Waiting for confirmation...");

      await addMessage.mutateAsync({
        conversationId: result.id,
        role: "user",
        content: promptTemplate(interest),
      });

      conversationsQuery.refetch();

      toast.success("Flow created successfully!");

      setOpen(false);
      setName("");
      setLogoUrl("");
      setDescription("");
      setInterest("");
    } catch (error) {
      console.error("Error creating collective:", error);
      toast.error(
        `Failed to create collective: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex justify-end">
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="bg-zinc-800 text-white hover:bg-zinc-700 rounded-lg py-3 px-4"
          >
            New Flow
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent className="sm:max-w-[425px] bg-white sm:rounded-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle>Create New Flow</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>General</Label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
              />
              <Input
                type="text"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="Logo URL (optional)"
              />
              <Input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
              />
            </div>

            <div className="space-y-2">
              <Label>Indexer</Label>
              <Textarea
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                placeholder="Describe an interest on farcaster you'd love to fund"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-zinc-800 text-white hover:bg-zinc-700 rounded-lg py-3"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Flow..." : "Create Flow"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewFlow;
