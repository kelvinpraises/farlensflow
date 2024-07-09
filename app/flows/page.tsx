import GlassContainer from "@/components/molecules/glass-container";
import NewFlow from "@/components/molecules/new-flow";
import FLows from "@/components/organisms/flows";

const sampleFLows = [
  {
    id: "1",
    name: "EcoTech Innovators",
    description:
      "Funding sustainable technology solutions for a greener future.",
    logoUrl:
      "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=200&h=200&fit=crop&crop=faces&auto=format&q=60",
  },
  {
    id: "2",
    name: "HealthHub Alliance",
    description:
      "Accelerating breakthroughs in medical research and healthcare accessibility.",
    logoUrl:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&h=200&fit=crop&crop=faces&auto=format&q=60",
  },
  {
    id: "3",
    name: "EdTech Frontiers",
    description:
      "Revolutionizing education through innovative learning technologies.",
    logoUrl:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200&h=200&fit=crop&crop=faces&auto=format&q=60",
  },
  {
    id: "4",
    name: "Urban Mobility Solutions",
    description:
      "Transforming city transportation for efficiency and sustainability.",
    logoUrl:
      "https://images.unsplash.com/photo-1615840287214-7ff58936c4cf?w=200&h=200&fit=crop&crop=faces&auto=format&q=60",
  },
  {
    id: "5",
    name: "AI Ethics Collective",
    description:
      "Ensuring responsible development and application of artificial intelligence.",
    logoUrl:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=200&h=200&fit=crop&crop=faces&auto=format&q=60",
  },
];

const FLowsHome = async () => {
  return (
    <GlassContainer>
      <p className="pt-4 px-4 font-semibold text-xl">FLows</p>
      <p className="px-4 pb-2 text-sm text-gray-700">
        Discover or create decentralised funding flows
      </p>
      <div className="flex flex-col rounded-2xl bg-[#F8F8F7] p-4 gap-4">
        <NewFlow />
        <FLows collectives={sampleFLows} />
      </div>
    </GlassContainer>
  );
};

export default FLowsHome;
