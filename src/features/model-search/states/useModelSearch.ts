import { api } from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { ModelSearchFormValues } from '../types';
import { onResetModelId, onUpdateModelId } from './useModelSelectorStores';

export const useModelSearch = () => {
  const { watch } = useFormContext<ModelSearchFormValues>();
  const query = watch('query');

  const { data, isLoading } = useQuery({
    queryKey: ['modelSearch', query],
    queryFn: () => api.searchModel(query),
  });

  useEffect(() => {
    onResetModelId();
  }, [query]);

  useEffect(() => {
    if (data) {
      const { models_search_info } = data;

      if (models_search_info.length > 0) {
        onUpdateModelId(models_search_info[0].id);
      }
    }
  }, [data]);

  return { data, isLoading };
};
