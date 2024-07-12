"use client";

import { AlertTriangle, Loader } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/atoms/alert";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/atoms/tabs";
import GlassContainer from "@/components/molecules/glass-container";
import ActiveFundings from "@/components/organisms/active-fundings";
import SuggestedFundings from "@/components/organisms/suggested-fundings";
import { useIndexNetwork } from "@/hooks/use-index-network";

interface FlowDetails {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
}

const FlowHome = () => {
  const { flow: conversationId } = useParams();
  const { conversationQuery, conversationsQuery } = useIndexNetwork(
    conversationId as string,
  );
  const isLoading = conversationQuery.isLoading || conversationsQuery.isLoading;
  const isError = conversationQuery.isError || conversationsQuery.isError;

  const flowDetails: FlowDetails | undefined = React.useMemo(() => {
    if (conversationQuery.data) {
      const parsedSummary = JSON.parse(conversationQuery.data.summary);
      return {
        id: conversationQuery.data.id,
        name: parsedSummary.name,
        description: parsedSummary.description,
        logoUrl: parsedSummary.logoUrl,
      };
    }
    return undefined;
  }, [conversationQuery.data]);

  return (
    <GlassContainer>
      <header>
        <h1 className="pt-4 px-4 font-semibold text-xl">
          {flowDetails?.name || "Flow Details"}
        </h1>
        <p className="px-4 pb-2 text-sm text-gray-700">
          {flowDetails?.description ||
            "Discover or create decentralised funding flows"}
        </p>
      </header>
      <main className="rounded-2xl bg-[#F8F8F7] p-4 flex-1">
        {isLoading ? (
          <LoadingState />
        ) : isError ? (
          <ErrorAlert
            error={
              (conversationQuery.error || conversationsQuery.error) as Error
            }
          />
        ) : (
          <Tabs className="flex flex-col gap-4" defaultValue="active">
            <TabsList className="grid w-full grid-cols-2 backdrop-blur-3xl bg-black/40 text-white">
              <TabsTrigger
                className="data-[state=active]:bg-black/30"
                value="active"
              >
                Active
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:bg-black/30"
                value="suggestions"
              >
                Suggestions
              </TabsTrigger>
            </TabsList>
            <TabsContent value="active">
              <ActiveFundings />
            </TabsContent>
            <TabsContent value="suggestions">
              <SuggestedFundings />
            </TabsContent>
          </Tabs>
        )}
      </main>
    </GlassContainer>
  );
};

const LoadingState: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <Loader className="animate-spin text-gray-500 -mt-36 mb-4" size={24} />
    <p className="text-gray-700">Loading flow details...</p>
  </div>
);

const ErrorAlert: React.FC<{ error: Error }> = ({ error }) => (
  <div className="flex flex-col items-center justify-center h-full gap-4">
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {error.message ||
          "An error occurred while fetching data. Please try again later."}
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

export default FlowHome;
