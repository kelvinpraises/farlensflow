"use client";

import { AlertTriangle, Loader } from "lucide-react";
import Image from "next/image";

import { Alert, AlertDescription, AlertTitle } from "@/components/atoms/alert";
import GlassContainer from "@/components/molecules/glass-container";
import NewFlow from "@/components/molecules/new-flow";
import Flows from "@/components/organisms/flows";
import { useIndexNetwork } from "@/hooks/use-index-network";

const FlowsHome = () => {
  const { conversationsQuery } = useIndexNetwork();

  const renderContent = () => {
    if (conversationsQuery.isLoading) {
      return <LoadingState />;
    }
    if (conversationsQuery.isError) {
      return <ErrorState error={conversationsQuery.error as Error} />;
    }
    if (conversationsQuery.isSuccess) {
      const collectives = conversationsQuery.data
        .map((item) => {
          try {
            const parsedSummary = JSON.parse(item.summary);
            return {
              id: item.id,
              name: parsedSummary.name,
              description: parsedSummary.description,
              logoUrl: parsedSummary.logoUrl,
            };
          } catch (e) {
            return null;
          }
        })
        .filter((item) => item !== null);

      if (collectives.length === 0) {
        return <EmptyState />;
      }

      return (
        <>
          <NewFlow />
          <Flows collectives={collectives} />
        </>
      );
    }
    if (conversationsQuery.isPending) {
      return (
        <ErrorState
          hideAlert
          error={Error("We couldn't get your flows just yet, please sign in!")}
        />
      );
    }
    return null;
  };

  return (
    <GlassContainer>
      <header>
        <h1 className="pt-4 px-4 font-semibold text-xl">Flows</h1>
        <p className="px-4 pb-2 text-sm text-gray-700">
          Discover or create decentralised funding flows
        </p>
      </header>
      <main className="rounded-2xl bg-[#F8F8F7] p-4 flex-1 flex flex-col gap-4">
        {renderContent()}
      </main>
    </GlassContainer>
  );
};

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <Loader className="animate-spin text-gray-500 -mt-36 mb-4" size={24} />
    <p className="text-gray-700">Loading flows...</p>
  </div>
);

const ErrorState = ({
  error,
  hideAlert,
}: {
  error: Error;
  hideAlert?: boolean;
}) => (
  <div className="flex flex-col items-center justify-center h-full gap-4">
    {!hideAlert && (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error.message ||
            "An error occurred while fetching flows. Please try again later."}
        </AlertDescription>
      </Alert>
    )}
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
        src="https://illustrations.popsy.co/red/flower.svg"
        width={350}
        height={350}
      />
      <h2 className="text-sm text-center sm:text-xl text-black mt-4">
        Click on New Flow to start your first flow
      </h2>
    </div>
    <NewFlow />
  </div>
);

export default FlowsHome;
