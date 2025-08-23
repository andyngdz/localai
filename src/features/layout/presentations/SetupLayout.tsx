'use client';

import { Divider } from '@heroui/divider';
import { Button } from '@heroui/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { FC, ReactNode } from 'react';
import { SetupLayoutBackground } from './SetupLayoutBackground';
import { SetupLayoutContent } from './SetupLayoutContent';

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
    <div className="relative min-h-screen flex flex-col items-center">
      <SetupLayoutBackground />
      <SetupLayoutContent title={title} description={description}>
        {children}
      </SetupLayoutContent>
      <Divider />
      <div className="w-full">
        <div className="flex justify-center items-center gap-8 py-2">
          {onBack && (
            <Button onPress={onBack} isIconOnly disabled={isBackDisabled}>
              <ChevronLeft />
            </Button>
          )}
          {onNext && (
            <Button onPress={onNext} isIconOnly disabled={isNextDisabled}>
              <ChevronRight />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
