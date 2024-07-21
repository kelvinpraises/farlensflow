import Image from "next/image";
import { useSelectedLayoutSegments } from "next/navigation";
import { useMemo } from "react";

import CustomSIWEButton from "@/components/molecules/custom-siwe-button";
import NavGroup from "@/components/molecules/nav-group";
import { cn } from "@/utils";

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
    <header
      className={cn(
        "grid grid-cols-[auto_1fr_auto] sm:grid-cols-3 items-center py-2 px-4 sm:py-4 gap-y-4 min-h-[70px] bg-transparent",
        className,
      )}
    >
      <div className="flex items-center">
        <Image
          alt="farlensflow logo"
          src="/farlensflow-logo-spin.svg"
          width={48}
          height={48}
          className="animate-[spin_12s_linear_infinite]"
        />
      </div>

      <NavGroup
        className="col-span-3 sm:col-span-1 order-last sm:order-none flex justify-center gap-4"
        navs={navs}
      />

      <div className="flex justify-end">
        <CustomSIWEButton />
      </div>
    </header>
  );
};

export default Header;
