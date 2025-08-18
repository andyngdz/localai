import { useModelSelectorStore } from '../states';

export const ModelSearchView = () => {
  const { model_id } = useModelSelectorStore();

  return <div>Model view: {model_id}</div>;
};
