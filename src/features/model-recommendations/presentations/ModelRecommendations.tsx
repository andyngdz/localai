'use client';

import { SetupLayout } from '@/features/layout/presentations/SetupLayout';
import { useRouter } from 'next/navigation';
import { FormProvider } from 'react-hook-form';
import { useModelRecommendation } from '../states/useModelRecommendation';
import { ModelRecommendationsList } from './ModelRecommendationsList';

export const ModelRecommendations = () => {
  const router = useRouter();
  const { methods, onSubmit, data } = useModelRecommendation();

  return (
    <FormProvider {...methods}>
      <SetupLayout
        title="Model Recommendations"
        description="Choose an AI model that fits your hardware capabilities and performance needs"
        onNext={methods.handleSubmit(onSubmit)}
        onBack={router.back}
      >
        {data && (
          <ModelRecommendationsList
            sections={data.sections}
            defaultSection={data.default_section}
          />
        )}
      </SetupLayout>
    </FormProvider>
  );
};
