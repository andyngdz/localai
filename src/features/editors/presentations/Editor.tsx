"use client";

import { Generator } from "@/features/generators/presentations/Generator";
import { Divider } from "@heroui/react";
import { EditorNavbar } from "./EditorNavbar";

export const Editor = () => {
  return (
    <div className="flex flex-col h-screen">
      <EditorNavbar />
      <Divider />
      <Generator />
    </div>
  );
};
