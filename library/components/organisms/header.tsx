import { useSelectedLayoutSegments } from "next/navigation";
import { useMemo } from "react";

import NavGroup from "@/components/molecules/nav-group";
import { cn } from "@/utils";
import CustomSIWEButton from "@/components/molecules/custom-siwe-button";

const Header = ({ className }: { className?: string }) => {
  const segments = useSelectedLayoutSegments();

  const navs = useMemo(
    () => [
      {
        title: "Home",
        value: "home",
        href: "/",
        isActive: segments.length === 0,
      },
      {
        title: "Flows",
        value: "flows",
        href: "/flows",
        isActive: segments.includes("flows"),
      },
      {
        title: "Collect",
        value: "collect",
        href: "/collect",
        isActive: segments.includes("collect"),
      },
    ],
    [segments],
  );

  return (
    <div
      className={cn(
        "flex justify-between items-center px-8 py-4 min-h-[70px] bg-transparent",
        className,
      )}
    >
      <div className="w-full">
        <img src="/senti-dripz-logo.png" alt="" className="w-8 opacity-85" />
      </div>
      <NavGroup className="flex w-full justify-center" navs={navs} />
      <div className="flex justify-end w-full">
        <CustomSIWEButton />
      </div>
    </div>
  );
};

export default Header;
