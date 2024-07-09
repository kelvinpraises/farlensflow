"use client";
import { useParams } from "next/navigation";

import GlassContainer from "@/components/molecules/glass-container";
import CollectiveDetails from "@/components/organisms/collective-details";
import Fundings from "@/components/organisms/fundings";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/atoms/tabs";

interface EcosystemWithId {
  collectiveId: number;
}

interface EcosystemData {
  id: string;
  title: string;
  description: string;
  tokenAmount: string;
  createdBy: string;
  createdAt: Date;
}

const CollectiveHome = () => {
  const { flow: flowId } = useParams();

  return (
    <GlassContainer>
      <p className="pt-4 px-4 font-semibold text-xl">Flow {flowId}</p>
      <p className="px-4 pb-2 text-sm text-gray-700">
        Discover or create decentralised funding flows
      </p>
      <div className="rounded-2xl bg-[#F8F8F7] p-4">
        <Tabs className="flex flex-col gap-4" defaultValue="home">
          <TabsList className="grid w-full grid-cols-2 backdrop-blur-3xl bg-black/40 text-white">
            <TabsTrigger
              className="data-[state=active]:bg-black/30"
              value="home"
            >
              Active
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-black/30"
              value="info"
            >
              Suggestions
            </TabsTrigger>
          </TabsList>
          <TabsContent value="home">
            <Fundings />
          </TabsContent>
          <TabsContent value="info">
            <CollectiveDetails />
          </TabsContent>
        </Tabs>
      </div>
    </GlassContainer>
  );
};

export default CollectiveHome;
