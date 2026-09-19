"use client";
import React, { Children, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import "./Stepper.css";

export function Step({ children }: { children: React.ReactNode }) {
  return <div className="step-default">{children}</div>;
}

export default function Stepper({
  children, initialStep = 1, onStepChange = () => {}, onFinalStepCompleted = () => {},
  backButtonText = "Back", nextButtonText = "Continue", disableNext = false,
}: {
  children: React.ReactNode; initialStep?: number; onStepChange?: (n: number) => void; onFinalStepCompleted?: () => void;
  backButtonText?: string; nextButtonText?: string; disableNext?: boolean;
}) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [direction, setDirection] = useState(0);
  const steps = Children.toArray(children);
  const total = steps.length;
  const last = currentStep === total;

  function go(n: number) {
    setCurrentStep(n);
    if (n > total) onFinalStepCompleted();
    else onStepChange(n);
  }

  return (
    <div className="outer-container">
      <div className="step-circle-container">
        <div className="step-indicator-row">
          {steps.map((_, i) => {
            const n = i + 1;
            const status = currentStep === n ? "active" : currentStep < n ? "inactive" : "complete";
            return (
              <React.Fragment key={n}>
                <button type="button" className={`step-dot ${status}`} onClick={() => { setDirection(n > currentStep ? 1 : -1); go(n); }}>{n}</button>
                {i < total - 1 && <div className={`step-line ${currentStep > n ? "on" : ""}`} />}
              </React.Fragment>
            );
          })}
        </div>
        <div className="step-content-default" style={{ position: "relative", minHeight: 180 }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={currentStep} initial={{ opacity: 0, x: direction >= 0 ? 24 : -24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: direction >= 0 ? -24 : 24 }}>
              {steps[currentStep - 1]}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="footer-container">
          <div className={`footer-nav ${currentStep !== 1 ? "spread" : "end"}`}>
            {currentStep !== 1 && <button type="button" className="back-button" onClick={() => { setDirection(-1); go(currentStep - 1); }}>{backButtonText}</button>}
            <button type="button" disabled={disableNext} className="next-button" onClick={() => { setDirection(1); last ? onFinalStepCompleted() : go(currentStep + 1); }}>
              {last ? "Complete" : nextButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
