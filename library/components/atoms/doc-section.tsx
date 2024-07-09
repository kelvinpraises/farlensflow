"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import React, { useState } from "react";

const DocSection = ({
  title,
  open,
  children,
}: {
  title: string;
  open?: boolean;
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(open ?? false);

  return (
    <div className="mb-4">
      <button
        className="flex items-center w-full text-left font-semibold text-lg mb-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <ChevronDown className="mr-2" />
        ) : (
          <ChevronRight className="mr-2" />
        )}
        {title}
      </button>
      {isOpen && <div className="pl-4">{children}</div>}
    </div>
  );
};

export default DocSection;
