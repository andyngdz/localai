import { useModelSelectorStore } from '../states';
import { useModelSearchView } from '../states/useModelSearchView';

import { ScrollShadow } from '@heroui/react';
import { ModelSearchViewCard } from './ModelSearchViewCard';
import { ModelSearchViewFiles } from './ModelSearchViewFiles';
import { ModelSearchViewFooter } from './ModelSearchViewFooter';
import { ModelSearchViewSpaces } from './ModelSearchViewSpaces';

export const ModelSearchView = () => {
  const { model_id } = useModelSelectorStore();
  const { modelDetails } = useModelSearchView(model_id);

  if (modelDetails) {
    return (
      <div className="flex flex-col gap-2 h-full">
        <ScrollShadow className="flex flex-col gap-8 p-6 scrollbar-thin">
          <ModelSearchViewCard
            author={modelDetails.author}
            downloads={modelDetails.downloads}
            id={modelDetails.id}
            likes={modelDetails.likes}
            tags={modelDetails.tags}
          />
          <ModelSearchViewSpaces spaces={modelDetails.spaces} />
          <ModelSearchViewFiles id={modelDetails.id} siblings={modelDetails.siblings} />
        </ScrollShadow>
        <ModelSearchViewFooter id={modelDetails.id} />
      </div>
    );
  }
};
