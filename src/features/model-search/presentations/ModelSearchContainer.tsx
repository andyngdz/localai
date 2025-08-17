'use client';

import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import { FormProvider, useForm } from 'react-hook-form';
import { ModelSearchFormValues } from '../types';
import { ModelSearchInput } from './ModelSearchInput';
import { ModelSearchListModel } from './ModelSearchListModel';

export const ModelSearchContainer = () => {
  const methods = useForm<ModelSearchFormValues>({
    mode: 'all',
    reValidateMode: 'onChange',
  });

  return (
    <FormProvider {...methods}>
      <Allotment defaultSizes={[300, 0]}>
        <Allotment.Pane maxSize={350} minSize={300} preferredSize={300}>
          <div className="flex flex-col gap-4 p-4 h-full">
            <ModelSearchInput />
            <ModelSearchListModel />
          </div>
        </Allotment.Pane>
        <Allotment.Pane className="flex flex-col">
          <div />
        </Allotment.Pane>
      </Allotment>
    </FormProvider>
  );
};
