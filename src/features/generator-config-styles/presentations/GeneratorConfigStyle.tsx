import { useStyleSectionsQuery } from "@/services/queries";
import { Button, Skeleton, useDisclosure } from "@heroui/react";
import { Plus } from "lucide-react";
import { GeneratorConfigStyleModal } from "./GeneratorConfigStyleModal";

export const GeneratorConfigStyle = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { data = [], isLoading } = useStyleSectionsQuery();

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex gap-4 items-center justify-between">
        <span className="font-semibold text-sm">Styles</span>
        {isLoading ? (
          <Skeleton className="rounded-xl w-10 h-10" />
        ) : (
          <Button variant="light" onPress={onOpen} isIconOnly>
            <Plus />
          </Button>
        )}
      </div>
      <GeneratorConfigStyleModal styleSections={data} isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
};
