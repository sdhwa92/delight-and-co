import { Check } from "lucide-react";

interface StepIndicatorProps {
  steps: string[];
  current: number;
}

export function StepIndicator({ steps, current }: StepIndicatorProps) {
  return (
    <div className="mb-8 flex items-center justify-center mx-auto">
      {steps.map((label, i) => {
        const num = i + 1;
        const done = num < current;
        const active = num === current;

        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="flex size-9 items-center justify-center rounded-full text-sm font-bold transition-colors"
                style={
                  done
                    ? { backgroundColor: "var(--brand-green)", color: "#fff" }
                    : active
                      ? { backgroundColor: "var(--brand-coral)", color: "#fff" }
                      : {
                          backgroundColor: "transparent",
                          color: "var(--brand-brown)",
                          border: "2px solid",
                          borderColor: "color-mix(in oklch, var(--brand-brown) 30%, transparent)",
                          opacity: 0.5,
                        }
                }
              >
                {done ? <Check size={16} strokeWidth={3} /> : num}
              </div>
              <span
                className="hidden text-xs font-semibold sm:block"
                style={{
                  color: "var(--brand-brown)",
                  opacity: active ? 1 : done ? 0.8 : 0.4,
                }}
              >
                {label}
              </span>
            </div>

            {i < steps.length - 1 && (
              <div
                className="mx-3 mb-0 h-0.5 w-12 shrink-0 transition-colors sm:mb-6 sm:w-16"
                style={{
                  backgroundColor: done
                    ? "var(--brand-green)"
                    : "color-mix(in oklch, var(--brand-brown) 20%, transparent)",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
