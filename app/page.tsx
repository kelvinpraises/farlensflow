import Image from "next/image";

import GlassContainer from "@/components/molecules/glass-container";

const IntentsHome = async () => {
  return (
    <GlassContainer>
      <p className="pt-4 px-4 font-semibold text-xl">Home</p>
      <p className="px-4 pb-2 text-sm text-gray-700">
        Fuel shared initiatives with decentralised funding flows
      </p>
      <div className="rounded-2xl bg-[#F8F8F7] p-4">
        <Image
          alt="query intents"
          src="/senti-dripz-tldr.svg"
          width={900}
          height={300}
        />
      </div>
    </GlassContainer>
  );
};

export default IntentsHome;
