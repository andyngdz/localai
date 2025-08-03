import { FC, PropsWithChildren } from "react";

export interface SetupLayoutHeaderProps {
  title: string;
  description: string;
}

export const SetupLayoutHeader: FC<
  PropsWithChildren<SetupLayoutHeaderProps>
> = ({ title, description, children }) => {
  return (
    <div className="max-w-4xl flex flex-1 items-center justify-center">
      <div className="mx-auto flex flex-col gap-8">
        <div className="flex flex-col gap-2 items-center justify-center">
          <h1 className="text-4xl font-bold text-base-content">{title}</h1>
          <span className="text-base-content/70">{description}</span>
        </div>
        <div className="flex justify-center">
          <div className="w-full">{children}</div>
        </div>
      </div>
    </div>
  );
};
