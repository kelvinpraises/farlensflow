"use client";

import { AlertTriangle, Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/atoms/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/atoms/alert";
import Card from "@/components/atoms/card";
import { CollectBody, CollectHead } from "@/components/molecules/collect";
import GlassContainer from "@/components/molecules/glass-container";
import { FundingFlowState, Token } from "@/types";

type GroupedFlows = {
  token: Token;
  fundingFlows: FundingFlowState[];
};

const STORAGE_KEY = "groupedFundingFlows";

const CollectHome = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [groupedFlows, setGroupedFlows] = useState<GroupedFlows[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadFlows = () => {
      try {
        const storedFlows = localStorage.getItem(STORAGE_KEY);
        if (storedFlows) {
          setGroupedFlows(JSON.parse(storedFlows));
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading flows from local storage:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to load flows"),
        );
        setIsLoading(false);
      }
    };

    loadFlows();
  }, []);

  useEffect(() => {
    const encodedFlow = searchParams.get("new-flow");
    if (encodedFlow) {
      try {
        const decodedFlow: FundingFlowState = JSON.parse(atob(encodedFlow));

        if (!decodedFlow.token) {
          throw new Error("Token information is missing");
        }

        if (
          !decodedFlow.token.address ||
          !decodedFlow.token.symbol ||
          !decodedFlow.token.name ||
          decodedFlow.token.address.trim() === "" ||
          decodedFlow.token.symbol.trim() === "" ||
          decodedFlow.token.name.trim() === ""
        ) {
          throw new Error("Invalid or empty token information");
        }

        setGroupedFlows((prevFlows) => {
          const updatedFlows = [...prevFlows];
          const existingTokenIndex = updatedFlows.findIndex(
            (group) => group.token.address === decodedFlow.token!.address,
          );

          if (existingTokenIndex > -1) {
            const flowExists = updatedFlows[
              existingTokenIndex
            ].fundingFlows.some(
              (flow) => JSON.stringify(flow) === JSON.stringify(decodedFlow),
            );
            if (!flowExists) {
              updatedFlows[existingTokenIndex].fundingFlows.push(decodedFlow);
              toast.success(`New flow added for ${decodedFlow.token!.symbol}`);
            } else {
              toast.info(
                `Flow already exists for ${decodedFlow.token!.symbol}`,
              );
            }
          } else {
            updatedFlows.push({
              token: decodedFlow.token!,
              fundingFlows: [decodedFlow],
            });
            toast.success(
              `New token group created for ${decodedFlow.token!.symbol}`,
            );
          }

          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFlows));
          return updatedFlows;
        });

        router.replace("/collect", { scroll: false });
      } catch (err) {
        console.error("Error processing new flow:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to process new flow"),
        );
        toast.error("Error processing new flow. Please try again.");
      }
    }
  }, [searchParams, router]);

  const renderContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }
    if (error) {
      return <ErrorState error={error} />;
    }
    if (groupedFlows.length === 0) {
      return <EmptyState />;
    }
    return <CollectFlows groupedFlows={groupedFlows} />;
  };

  return renderContent();
};

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <Loader className="animate-spin text-gray-500 -mt-36 mb-4" size={24} />
    <p className="text-gray-700">Loading flows...</p>
  </div>
);

const ErrorState = ({ error }: { error: Error }) => (
  <div className="flex flex-col items-center justify-center h-full gap-4">
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {error.message ||
          "An error occurred while fetching flows. Please try again later."}
      </AlertDescription>
    </Alert>
    <div className="flex flex-col items-center justify-center">
      <Image
        alt="errors happeneth"
        src="https://illustrations.popsy.co/red/timed-out-error.svg"
        width={350}
        height={350}
      />
      <h2 className="text-sm text-center sm:text-xl text-black mt-4">
        {error.message || "Errors happeneth"}
      </h2>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full gap-4">
    <div className="flex flex-col items-center justify-center">
      <Image
        alt="query intents"
        src="https://illustrations.popsy.co/red/earning-money.svg"
        width={350}
        height={350}
      />
      <h2 className="text-sm text-center sm:text-xl text-black mt-4">
        Empty flows, full potential. Cast away!
      </h2>
    </div>
  </div>
);

const CollectFlows = ({ groupedFlows }: { groupedFlows: GroupedFlows[] }) => (
  <Accordion type="multiple" className="w-full flex flex-col gap-2">
    {groupedFlows.map((group, index) => (
      <Card key={index} className="rounded-lg p-0">
        <AccordionItem value={`${index}`} className="border-b-0">
          <AccordionTrigger className="p-4">
            <CollectHead token={group.token} />
          </AccordionTrigger>
          <AccordionContent className="pb-4 px-4">
            <CollectBody
              token={group.token}
              fundingFlows={group.fundingFlows}
            />
          </AccordionContent>
        </AccordionItem>
      </Card>
    ))}
  </Accordion>
);

const CollectHomeWithSuspense = () => {
  return (
    <GlassContainer>
      <header>
        <h1 className="pt-4 px-4 font-semibold text-xl">Collect</h1>
        <p className="px-4 pb-2 text-sm text-gray-700">
          Collect and view funding flow details
        </p>
      </header>
      <main className="rounded-2xl bg-[#F8F8F7] p-4 flex-1 flex flex-col gap-4">
        <Alert>
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            Have anyone on the{" "}
            <Link href="/flows" className="text-[#F26DB7] hover:underline">
              Flows
            </Link>{" "}
            page send you flows and its link to start collecting
          </AlertDescription>
        </Alert>
        <Suspense fallback={<LoadingState />}>
          <CollectHome />
        </Suspense>
      </main>
    </GlassContainer>
  );
};

export default CollectHomeWithSuspense;
