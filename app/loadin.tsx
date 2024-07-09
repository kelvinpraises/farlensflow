import GlassContainer from "@/components/molecules/glass-container";

const Loading = () => {
  return (
    <GlassContainer>
     <p className="mt-4 mx-4 mb-2 w-fit text-transparent bg-gray-300 rounded animate-pulse font-semibold text-xl">Documentation</p>
      <div className="rounded-2xl bg-gray-200 p-4">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-4 animate-pulse"></div>
        <div className="h-4 bg-gray-300 rounded mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-300 rounded mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6 mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse"></div>
      </div>
    </GlassContainer>
  );
};

export default Loading;
