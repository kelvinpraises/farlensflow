import Image from "next/image";

import GlassContainer from "@/components/molecules/glass-container";

const IntentsHome = async () => {
  return (
    <GlassContainer>
      <header>
        <h1 className="pt-4 px-4 font-semibold text-xl">Home</h1>
        <p className="px-4 pb-2 text-sm text-gray-700">
          Fuel shared initiatives with decentralised funding flows
        </p>
      </header>
      <main className="rounded-2xl bg-[#F8F8F7] p-4 flex-1">
        <div className="flex flex-col items-center">
          <Image
            alt="lens"
            src="https://illustrations.popsy.co/red/photographer.svg"
            width={400}
            height={400}
          />
          <h2 className="text-sm text-center sm:text-xl text-black">
            Peer into the social depths and unlock the power of flows
          </h2>
        </div>
      </main>
    </GlassContainer>
  );
};

export default IntentsHome;
