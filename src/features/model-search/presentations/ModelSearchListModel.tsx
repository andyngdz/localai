import { Alert, ScrollShadow, Spinner } from '@heroui/react';
import { isEmpty } from 'es-toolkit/compat';
import { useModelSearch } from '../states';
import { ModelSearchItem } from './ModelSearchItem';

export const ModelSearchListModel = () => {
  const { data, isLoading } = useModelSearch();

  if (isLoading) {
    return <Spinner />;
  }

  if (data) {
    const { models_search_info } = data;

    if (isEmpty(models_search_info)) {
      return (
        <Alert className="grow-0" color="warning">
          No models found
        </Alert>
      );
    }

    return (
      <ScrollShadow className="scrollbar-thin">
        <div className="flex flex-col gap-2">
          {models_search_info.map((model) => (
            <ModelSearchItem key={model.id} modelSearchInfo={model} />
          ))}
        </div>
      </ScrollShadow>
    );
  }
};
