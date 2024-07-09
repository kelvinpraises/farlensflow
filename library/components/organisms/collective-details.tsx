import React, { useState } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { toast } from "sonner";

const CollectiveDetails = () => {
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };

  const handleFaucetRequest = async () => {
    setIsSubmitting(true);
    try {
      // Implement faucet request logic here
      console.log("Faucet request initiated for address:", address);
      // Simulating an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Faucet request completed");

      // Success notification
      toast("Event has been created", {
        description: "Sunday, December 03, 2023 at 9:00 AM",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
    } catch (error) {
      console.error("Faucet request failed:", error);
      // Error notification
      toast.error("Failed to request tokens", {
        description: "Please try again later or contact support.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Basic Ethereum address validation
  const isValidAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="font-semibold w-fit text-lg text-gray-800">
        Collective Faucet
      </p>

      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        <Input
          id="address"
          value={address}
          onChange={handleAddressChange}
          placeholder="Enter Ethereum address (0x...)"
          className="w-full"
        />
        <Button
          className="bg-zinc-800 text-white hover:bg-zinc-700 sm:w-auto"
          onClick={handleFaucetRequest}
          disabled={isSubmitting || !isValidAddress(address)}
        >
          {isSubmitting ? "Processing..." : "Request Tokens"}
        </Button>
      </div>
    </div>
  );
};

export default CollectiveDetails;
