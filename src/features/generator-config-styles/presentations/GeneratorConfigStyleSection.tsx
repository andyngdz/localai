import { StyleSection } from "@/types";
import { FC } from "react";
import { GeneratorConfigStyleItem } from "./GeneratorConfigStyleItem";

interface GeneratorConfigStyleSectionProps {
  styleSections: StyleSection[];
}

export const GeneratorConfigStyleSection: FC<GeneratorConfigStyleSectionProps> = ({
  styleSections,
}) => {
  return styleSections.map((styleSeection) => {
    return (
      <div key={styleSeection.id} className="flex flex-col gap-2">
        <span className="text-lg font-medium capitalize bg-foreground-100 p-2">
          {styleSeection.id}
        </span>
        <div className="flex flex-wrap gap-2 p-2">
          {styleSeection.styles.map((styleItem) => {
            return <GeneratorConfigStyleItem key={styleItem.id} styleItem={styleItem} />;
          })}
        </div>
      </div>
    );
  });
};
