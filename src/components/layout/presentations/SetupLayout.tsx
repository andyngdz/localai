import { ChevronLeft, ChevronRight } from "lucide-react";
import type { FC, ReactNode } from "react";
import { SetupLayoutHeader } from "./SetupLayoutHeader";

export interface SetupLayoutProps {
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
    <div className="min-h-screen bg-base-200 flex flex-col items-center">
      <SetupLayoutHeader title={title} description={description}>
        {children}
      </SetupLayoutHeader>
      <div className="w-full border-t border-gray-800">
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
