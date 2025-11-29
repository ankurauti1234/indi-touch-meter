// src/components/MultiStepWizard.tsx
import React, { createContext, useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "./separator";
import { StatusBar } from "./status-bar";

import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTrigger,
} from "@/components/ui/stepper";

const StepContext = createContext({
  currentStep: 0,
  setCurrentStep: (_step: number) => {},
  goNext: () => {},
  goPrevious: () => {},
  isFirstStep: false,
  isLastStep: false,
});

export function useStep() {
  const context = useContext(StepContext);
  if (!context) {
    throw new Error("useStep must be used within a MultiStepWizard");
  }
  return context;
}

interface MultiStepWizardProps {
  children: React.ReactNode;
}

export function MultiStepWizard({ children }: MultiStepWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const allChildren = React.Children.toArray(children);

  const isMembersStep = currentStep === allChildren.length - 1;

  // Stepper excludes the members step
  const stepCount = allChildren.length - 1;
  const visibleStepNumber = Math.min(currentStep + 1, stepCount);

  const goNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, allChildren.length - 1));
  };

  const goPrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const isFirstStep = currentStep === 0;

  return (
    <StepContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        goNext,
        goPrevious,
        isFirstStep,
        isLastStep: isMembersStep,
      }}
    >
      <div className="flex flex-col min-h-screen">

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col">

          {isMembersStep ? (
            /* FULL SCREEN MEMBERS GRID */
            <div className="flex-1 w-full p-4 overflow-auto">
              {allChildren[currentStep]}
            </div>
          ) : (
            /* NORMAL STEPS WITH CARD */
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-4xl z-10">
                <Card className="w-full gap-0 p-0">
                  
                  {/* HEADER + STEPPER */}
                  <CardHeader className="p-4 flex items-center justify-between">
                    <CardTitle className="text-xl">Setup Wizard</CardTitle>

                    <Stepper
                      value={visibleStepNumber}
                      className="max-w-md bg-secondary/25 p-2 rounded-lg border"
                    >
                      {Array.from({ length: stepCount }, (_, index) => {
                        const step = index + 1;
                        return (
                          <StepperItem key={step} step={step} className="not-last:flex-1">
                            <StepperTrigger>
                              <StepperIndicator />
                            </StepperTrigger>
                            {step < stepCount && <StepperSeparator />}
                          </StepperItem>
                        );
                      })}
                    </Stepper>
                  </CardHeader>

                  <Separator />

                  {/* CONTENT */}
                  <CardContent className="p-4 min-h-64 flex items-center justify-center">
                    {allChildren[currentStep]}
                  </CardContent>

                  <Separator />

                  {/* FOOTER BUTTONS */}
                  <CardFooter className="flex justify-between items-center p-4">
                    <Button
                      variant="outline"
                      onClick={goPrevious}
                      disabled={isFirstStep}
                    >
                      Previous
                    </Button>

                    {visibleStepNumber === stepCount ? (
                      <Button onClick={goNext}>Finish</Button>
                    ) : (
                      <Button onClick={goNext}>Next</Button>
                    )}
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* STATUS BAR ALWAYS AT BOTTOM */}
        <StatusBar />
      </div>
    </StepContext.Provider>
  );
}
