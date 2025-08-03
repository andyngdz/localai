import type { FC, ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SetupLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  onNext?: VoidFunction;
  onBack?: VoidFunction;
  isNextDisabled?: boolean;
  isBackDisabled?: boolean;
}

export const SetupLayout: FC<SetupLayoutProps> = ({
  title,
  description,
  children,
  onNext,
  onBack,
  isNextDisabled = false,
  isBackDisabled = false,
}) => {
  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <div className="flex flex-1 items-center justify-center">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          <div className="flex flex-col gap-2 items-center justify-center">
            <h1 className="text-4xl font-bold text-base-content">{title}</h1>
            <span className="text-base-content/70">{description}</span>
          </div>
          <div className="flex justify-center">
            <div className="w-full">{children}</div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="flex justify-center items-center gap-8 py-2">
          {onBack && (
            <button
              className="btn btn-soft btn-circle gap-2"
              onClick={onBack}
              disabled={isBackDisabled}
            >
              <ChevronLeft />
            </button>
          )}
          {onNext && (
            <button
              className="btn btn-soft btn-circle gap-2"
              onClick={onNext}
              disabled={isNextDisabled}
            >
              <ChevronRight />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
