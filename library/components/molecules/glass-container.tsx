import React from "react";

const GlassContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex justify-center w-full">
      <div className=" backdrop-blur-3xl bg-black/30 rounded-3xl p-2 m-4 w-full max-w-[700px]">
        {children}
      </div>
    </div>
  );
};

export default GlassContainer;
