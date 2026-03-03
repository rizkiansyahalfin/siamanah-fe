import { Check } from "lucide-react";

export interface Step {
    label: string;
    active: boolean;
    done: boolean;
}

interface StepperProps {
    steps: Step[];
    onStepClick?: (index: number) => void;
}

export function Stepper({ steps, onStepClick }: StepperProps) {
    return (
        <div className="flex items-center justify-between mb-8 sm:mb-16 relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>
            {steps.map((step, i) => (
                <div 
                    key={i} 
                    className={`relative z-10 flex flex-col items-center gap-2 group ${onStepClick ? 'cursor-pointer' : ''}`}
                    onClick={() => {
                        // Only allow clicking steps before current active step for safety, 
                        // or if parent explicitly handles it
                        if (onStepClick && (step.done || step.active)) {
                            onStepClick(i);
                        }
                    }}
                >
                    <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all border-4 ${step.active ? "bg-green-600 text-white border-green-100" :
                        step.done ? "bg-green-100 text-green-600 border-white" :
                            "bg-white text-slate-300 border-slate-50"
                        }`}>
                        {step.done ? <Check className="h-5 w-5" /> : i + 1}
                    </div>
                    <span className={`hidden sm:block text-xs font-bold uppercase tracking-widest ${step.active ? "text-green-600" : "text-slate-400 group-hover:text-slate-600"}`}>{step.label}</span>
                </div>
            ))}
        </div>
    );
}
