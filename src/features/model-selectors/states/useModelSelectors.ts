import { useDownloadedModels } from "@/services/queries";
import { first, isEmpty } from "es-toolkit/compat";
import { useEffect } from "react";
import { useModelSelectorStore } from "./useModelSelectorStores";

export const useModelSelectors = () => {
  const { data = [] } = useDownloadedModels();
  const { id, setId } = useModelSelectorStore((state) => state);

  useEffect(() => {
    if (data && isEmpty(id)) {
      const firstModel = first(data);
      if (firstModel) setId(firstModel.model_id);
    }
  }, [data, id, setId]);

  return { data };
};
