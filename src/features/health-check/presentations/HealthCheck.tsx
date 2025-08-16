'use client';

import { DeviceSelection } from '@/cores/constants';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { useHealthQuery } from '../../../services/queries';
import { SetupLayout } from '../../layout/presentations/SetupLayout';
import { HealthCheckContent } from './HealthCheckContent';

export const HealthCheck = () => {
  const router = useRouter();
  const { data } = useHealthQuery();
  const isHealthy = !!data;

  const onNext = () => {
    if (isHealthy) {
      router.push('/gpu-detection');
    }
  };

  const onCheckDeviceIndex = useCallback(async () => {
    const { device_index } = await api.getDeviceIndex();

    if (device_index !== DeviceSelection.NOT_FOUND) {
      router.push('/editor');
    }
  }, [router]);

  useEffect(() => {
    onCheckDeviceIndex();
  }, [onCheckDeviceIndex]);

  return (
    <SetupLayout
      title="Health Check"
      description="Checking the connection to your LocalAI backend server"
      onNext={onNext}
      isNextDisabled={!isHealthy}
    >
      <HealthCheckContent isHealthy={isHealthy} />
    </SetupLayout>
  );
};
