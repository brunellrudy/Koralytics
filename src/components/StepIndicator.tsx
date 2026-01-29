import { Step } from '../lib/types';

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => (
  <div className="mb-6">
    <div className="flex items-center justify-between text-xs font-medium text-slate-500">
      {steps.map((step, index) => (
        <span key={step.id} className={index === currentStep ? 'text-slate-900' : ''}>
          {step.label}
        </span>
      ))}
    </div>
    <div className="mt-3 h-2 w-full rounded-full bg-slate-200">
      <div
        className="h-2 rounded-full bg-accent transition-all"
        style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
      />
    </div>
  </div>
);

export default StepIndicator;
