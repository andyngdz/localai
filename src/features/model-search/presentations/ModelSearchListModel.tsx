import { api } from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import { useFormContext } from 'react-hook-form';
import { ModelSearchFormValues } from '../types';
import { ModelSearchItem } from './ModelSearchItem';

export const ModelSearchListModel = () => {
  const { watch } = useFormContext<ModelSearchFormValues>();
  const query = watch('query');

  const { data } = useQuery({
    queryKey: ['modelSearch', query],
    queryFn: () => api.searchModel(query),
  });

  if (data) {
    const { models_search_info } = data;

    return (
      <div className="scrollbar-thin overflow-auto">
        <div className="flex flex-col gap-2">
          {models_search_info.map((model) => (
            <ModelSearchItem key={model.id} modelSearchInfo={model} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <span>No models found</span>
    </div>
  );
};
