"use client";

import { AlertTriangle } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/atoms/alert";
import { Skeleton } from "@/components/atoms/skeleton";
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

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isError) {
    return (
      <ErrorAlert
        error={(conversationQuery.error || conversationsQuery.error) as Error}
      />
    );
  }

  return (
    <GlassContainer>
      <header className="px-4 py-4">
        <h1 className="font-semibold text-xl">
          {flowDetails?.name || "Flow Details"}
        </h1>
        <p className="text-sm text-gray-700">
          {flowDetails?.description ||
            "Discover or create decentralised funding flows"}
        </p>
      </header>
      <main className="rounded-2xl bg-[#F8F8F7] p-4">
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
      </main>
    </GlassContainer>
  );
};

const LoadingSkeleton: React.FC = () => (
  <GlassContainer>
    <div className="px-4 py-4">
      <Skeleton className="h-8 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full" />
    </div>
    <div className="rounded-2xl bg-[#F8F8F7] p-4">
      <Skeleton className="h-10 w-full mb-4" />
      <Skeleton className="h-40 w-full" />
    </div>
  </GlassContainer>
);

const ErrorAlert: React.FC<{ error: Error }> = ({ error }) => (
  <Alert variant="destructive">
    <AlertTriangle className="h-4 w-4" />
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>
      {error.message ||
        "An error occurred while fetching data. Please try again later."}
    </AlertDescription>
  </Alert>
);

export default FlowHome;
