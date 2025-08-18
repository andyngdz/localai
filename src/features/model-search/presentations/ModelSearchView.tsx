import { useModelSelectorStore } from '../states';
import { useModelSearchView } from '../states/useModelSearchView';

import { ModelSearchViewCard } from './ModelSearchViewCard';

export const ModelSearchView = () => {
  const { model_id } = useModelSelectorStore();
  const { modelDetails } = useModelSearchView(model_id);

  if (modelDetails) {
    return (
      <div className="p-6">
        <ModelSearchViewCard modelDetails={modelDetails} />
      </div>
    );
  }
};
