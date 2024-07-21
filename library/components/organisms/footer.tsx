import Image from "next/image";

import { cn } from "@/utils";

const Footer = ({ className }: { className?: string }) => {
  return (
    <footer className="flex-1 flex items-end">
      <div
        className={cn(
          "flex justify-between items-center py-2 px-4 sm:py-4 w-full",
          className,
        )}
      >
        <div className="flex items-center">
          <Image
            alt="farlensflow logo"
            src="/farlensflow-logo-spin.svg"
            width={72}
            height={72}
          />
        </div>

        <p className="flex justify-end">
          💖 by&nbsp;<strong>kelvinpraises</strong>&nbsp;| 2024
        </p>
      </div>
    </footer>
  );
};

export default Footer;
