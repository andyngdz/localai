import { Button } from "@heroui/react";
import { Plus } from "lucide-react";

export const GeneratorConfigStyle = () => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex gap-4 items-center justify-between">
        <span className="font-semibold text-sm">Styles</span>
        <Button variant="light" isIconOnly>
          <Plus />
        </Button>
      </div>
    </div>
  );
};
