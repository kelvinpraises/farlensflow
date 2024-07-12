import { useState, useEffect } from "react";
import { FundingFlowState } from "@/types";

export const useFundingFlows = (STORAGE_KEY: string) => {
  const [fundingFlows, setFundingFlows] = useState<FundingFlowState[]>([]);

  useEffect(() => {
    const storedFlows = localStorage.getItem(STORAGE_KEY);
    if (storedFlows) {
      setFundingFlows(JSON.parse(storedFlows));
    }
  }, [STORAGE_KEY]);

  const saveFundingFlow = (flow: FundingFlowState) => {
    const newFlows = [
      ...fundingFlows,
      { ...flow, createdAt: new Date().toISOString() },
    ];
    setFundingFlows(newFlows);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newFlows));
  };

  const updateFundingFlow = (
    index: number,
    updatedFlow: Partial<FundingFlowState>,
  ) => {
    const newFlows = [...fundingFlows];
    newFlows[index] = { ...newFlows[index], ...updatedFlow };
    setFundingFlows(newFlows);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newFlows));
  };

  const deleteFundingFlow = (index: number) => {
    const newFlows = fundingFlows.filter((_, i) => i !== index);
    setFundingFlows(newFlows);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newFlows));
  };

  return {
    fundingFlows,
    saveFundingFlow,
    updateFundingFlow,
    deleteFundingFlow,
  };
};
