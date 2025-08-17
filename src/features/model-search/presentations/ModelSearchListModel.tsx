import { useFormContext } from 'react-hook-form';
import { ModelSearchFormValues } from '../types';

export const ModelSearchListModel = () => {
  const { watch } = useFormContext<ModelSearchFormValues>();
  const query = watch('query');

  return <div>{query}</div>;
};
