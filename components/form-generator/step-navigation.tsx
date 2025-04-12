"use client";

import { Button } from "@/components/ui/button";

interface StepNavigationProps {
  steps: string[];
  currentStep: number;
  onStepChange: (step: number) => void;
}

export default function StepNavigation({
  steps,
  currentStep,
  onStepChange,
}: StepNavigationProps) {
  return (
    <div className="grid grid-cols-3 gap-2 bg-gray-200 p-2 rounded-md">
      {steps.map((step, index) => (
        <Button
          key={step}
          className={`w-full hover:bg-[#7ba2cf] ${
            currentStep === index
              ? "bg-[#4A90E2] hover:bg-[#4A90E2] text-white"
              : "bg-gray-300 text-black"
          }`}
          onClick={() => onStepChange(index)}
        >
          {step}
        </Button>
      ))}
    </div>
  );
}
