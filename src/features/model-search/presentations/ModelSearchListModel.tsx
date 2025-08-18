import { Alert, Spinner } from '@heroui/react';
import { useModelSearch } from '../states';
import { ModelSearchItem } from './ModelSearchItem';

export const ModelSearchListModel = () => {
  const { data, isLoading } = useModelSearch();

  if (isLoading) {
    return <Spinner />;
  }

  if (data) {
    const { models_search_info } = data;

    if (models_search_info.length === 0) {
      return <Alert>No models found</Alert>;
    }

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
};
