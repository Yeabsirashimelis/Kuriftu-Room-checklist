"use client";

import FormGeneratorStep from "@/components/form-generator/form-generator-step";
import PublishStep from "@/components/form-generator/publish-step";
import ReviewStep from "@/components/form-generator/review-step";
import StepNavigation from "@/components/form-generator/step-navigation";
import { useState } from "react";

export default function Page() {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = ["Generate", "Review", "Publish"];

  return (
    <div className=" mx-auto p-4 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <StepNavigation
          steps={steps}
          currentStep={currentStep}
          onStepChange={(step) => setCurrentStep(step)}
        />
      </div>

      {currentStep === 0 && <FormGeneratorStep />}
      {currentStep === 1 && <ReviewStep />}
      {currentStep === 2 && <PublishStep />}
    </div>
  );
}
