"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTrigger,
} from "@/components/ui/stepper";

import { motion, AnimatePresence } from "motion/react";
import { Loader2 } from "lucide-react";

/* ------------------------------------------------------------ */
/* STEP CONTEXT */
/* ------------------------------------------------------------ */

const StepContext = createContext({
  currentStep: 0,
  goNext: () => {},
  goPrevious: () => {},
  isFirstStep: false,
  isLastStep: false,
});

export function useStep() {
  return useContext(StepContext);
}

/* ------------------------------------------------------------ */
/* LOADING SCREEN COMPONENT */
/* ------------------------------------------------------------ */

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [currentMessage, setCurrentMessage] = useState(0);
  
const messages = [
  "Verifying device configuration...",
  "Syncing time and firmware versions...",
  "Calibrating sensors and input sources...",
  "Validating network and server connection...",
  "Initializing AI models and detection modules...",
  "Checking audio fingerprinting engine...",
  "Registering device with cloud services...",
  "Applying final security checks...",
  "Preparing dashboard and user interface...",
  "Setup complete. Launching application...",
];


  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 1000);

    const completeTimeout = setTimeout(() => {
      onComplete();
    }, 10000);

    return () => {
      clearInterval(messageInterval);
      clearTimeout(completeTimeout);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className="w-16 h-16 text-primary" />
      </motion.div>
      
      <div className="text-center">
        <AnimatePresence mode="wait">
          <motion.h2
            key={currentMessage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="text-2xl font-semibold"
          >
            {messages[currentMessage]}
          </motion.h2>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ */
/* MULTI STEP WIZARD */
/* ------------------------------------------------------------ */

export function MultiStepWizard({
  steps,
}: {
  steps: (React.ComponentType<any> & { stepTitle?: string })[];
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const totalSteps = steps.length;

  const WELCOME_INDEX = 0;
  const MEMBERS_INDEX = totalSteps - 1;

  const FIRST_STEPPER_INDEX = 1;
  const LAST_STEPPER_INDEX = totalSteps - 2;

  const StepComponent = steps[currentStep];
  const stepTitle = (StepComponent as any).stepTitle || "";

  const isFirstStep = currentStep === WELCOME_INDEX;
  const isLastStep = currentStep === MEMBERS_INDEX;

  const stepCount = LAST_STEPPER_INDEX - FIRST_STEPPER_INDEX + 1;

  const visibleStepNumber =
    currentStep <= FIRST_STEPPER_INDEX
      ? 1
      : Math.min(currentStep - FIRST_STEPPER_INDEX + 1, stepCount);

  const goNext = () => {
    // Check if we're on the second-to-last step (last stepper step)
    if (currentStep === LAST_STEPPER_INDEX) {
      setIsLoading(true);
      // Loading screen will call handleLoadingComplete after 5 seconds
    } else {
      setDirection(1);
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
    }
  };

  const goPrevious = () => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
    setDirection(1);
    setCurrentStep(MEMBERS_INDEX);
  };

  /* ------------------------------------------------------------ */
  /* SLIDE ANIMATION VARIANTS */
  /* ------------------------------------------------------------ */

  const slideVariants = {
    initial: (dir: number) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
      position: "absolute",
      width: "100%",
    }),
    animate: {
      x: 0,
      opacity: 1,
      position: "relative",
      transition: { duration: 0.3 },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -60 : 60,
      opacity: 0,
      position: "absolute",
      width: "100%",
      transition: { duration: 0.2 },
    }),
  };

  const shouldAnimate =
    !isFirstStep && !isLastStep; // only middle steps animate

  return (
    <StepContext.Provider
      value={{
        currentStep,
        goNext,
        goPrevious,
        isFirstStep,
        isLastStep,
      }}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col">

          {/* ------------------------------------------------------------ */}
          {/* 1) FIRST STEP - NO CARD, NO ANIMATION */}
          {/* ------------------------------------------------------------ */}
          {isFirstStep && (
            <div className="p-4 flex-1 overflow-auto">
              <StepComponent />
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* 2) MIDDLE STEPS - CARD + TITLE + STEPPER + ANIMATION */}
          {/* ------------------------------------------------------------ */}
          {!isFirstStep && !isLastStep && !isLoading && (
            <div className="flex-1 flex justify-center items-center">
              <div className="w-full max-w-4xl">
                <Card className="w-full p-0 gap-0">
                  <CardHeader className="flex justify-between p-4">
                    <CardTitle className="text-2xl font-light p-0 ">{stepTitle}</CardTitle>

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

                  <CardContent className="relative p-0 overflow-hidden">
                    <AnimatePresence mode="popLayout" custom={direction}>
                      {shouldAnimate ? (
                        <motion.div
                          key={currentStep}
                          custom={direction}
                          variants={slideVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                        >
                          <StepComponent />
                        </motion.div>
                      ) : (
                        <div>
                          <StepComponent />
                        </div>
                      )}
                    </AnimatePresence>
                  </CardContent>

                  <Separator />

                  <CardFooter className="flex justify-between p-4">
                    <Button 
                      variant="outline" 
                      onClick={goPrevious}
                      disabled={isLoading}
                    >
                      Previous
                    </Button>

                    <Button 
                      onClick={goNext}
                      disabled={isLoading}
                    >
                      {currentStep === LAST_STEPPER_INDEX ? "Finish" : "Next"}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* LOADING SCREEN - FULLSCREEN, NO CARD */}
          {/* ------------------------------------------------------------ */}
          {isLoading && (
            <div className="flex-1">
              <LoadingScreen onComplete={handleLoadingComplete} />
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* 3) LAST STEP - NO CARD, NO ANIMATION */}
          {/* ------------------------------------------------------------ */}
          {isLastStep && (
            <div className="p-4 flex-1 overflow-auto">
              <StepComponent />
            </div>
          )}
        </div>
      </div>
    </StepContext.Provider>
  );
}