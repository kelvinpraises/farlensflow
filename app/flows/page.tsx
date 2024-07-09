"use client";

import GlassContainer from "@/components/molecules/glass-container";
import NewFlow from "@/components/molecules/new-flow";
import FLows from "@/components/organisms/flows";
import { useIndexNetwork } from "@/hooks/use-index-network";

const FLowsHome = () => {
  const { conversationsQuery } = useIndexNetwork();

  return (
    <GlassContainer>
      <p className="pt-4 px-4 font-semibold text-xl">FLows</p>
      <p className="px-4 pb-2 text-sm text-gray-700">
        Discover or create decentralised funding flows
      </p>
      {conversationsQuery.isSuccess && (
        <div className="flex flex-col rounded-2xl bg-[#F8F8F7] p-4 gap-4">
          <NewFlow />
          <FLows
            collectives={conversationsQuery.data
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
                  // Skip this item if JSON parsing fails
                  return null;
                }
              })
              .filter((item) => item !== null)}
          />
        </div>
      )}
    </GlassContainer>
  );
};

export default FLowsHome;
