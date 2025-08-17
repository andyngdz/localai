'use client';

import { Chip } from '@heroui/react';
import { FC, useMemo } from 'react';

export interface HealthCheckContentProps {
  isHealthy: boolean;
}

export const HealthCheckContent: FC<HealthCheckContentProps> = ({ isHealthy }) => {
  const children = useMemo(() => {
    if (isHealthy) {
      return (
        <Chip color="success">
          <span>LocalAI backend is running and ready to use</span>
        </Chip>
      );
    }

    return (
      <Chip color="danger">
        <span>LocalAI backend is not running</span>
      </Chip>
    );
  }, [isHealthy]);

  return <div className="flex justify-center">{children}</div>;
};
