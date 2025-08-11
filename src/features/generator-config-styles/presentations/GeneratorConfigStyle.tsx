import { useStyleSectionsQuery } from "@/services/queries";
import { Button, Skeleton } from "@heroui/react";
import { Plus } from "lucide-react";

export const GeneratorConfigStyle = () => {
  const { data, isLoading } = useStyleSectionsQuery();

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex gap-4 items-center justify-between">
        <span className="font-semibold text-sm">Styles</span>
        {isLoading ? (
          <Skeleton className="rounded-xl w-10 h-10" />
        ) : (
          <Button variant="light" isIconOnly>
            <Plus />
          </Button>
        )}
      </div>
    </div>
  );
};
