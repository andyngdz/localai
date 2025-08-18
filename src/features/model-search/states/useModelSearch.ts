import { api } from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import { first } from 'es-toolkit/compat';
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
      const firstModelSearchInfo = first(models_search_info);

      if (firstModelSearchInfo) {
        onUpdateModelId(firstModelSearchInfo.id);
      }
    }
  }, [data]);

  return { data, isLoading };
};
