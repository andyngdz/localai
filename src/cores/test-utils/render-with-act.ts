import React from "react";
import { render, RenderOptions, RenderResult } from "@testing-library/react";
import { act } from "react";
import { createQueryClientWrapper } from "./query-client";

/**
 * Renders a component wrapped in React's act() and with a QueryClient provider.
 * This helps prevent React state update warnings in tests.
 *
 * @param ui The component to render
 * @param options Optional render options
 * @returns A promise that resolves to the render result
 */
export const renderWithAct = async (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
): Promise<RenderResult> => {
  let renderResult: RenderResult | undefined;

  await act(async () => {
    renderResult = render(ui, {
      wrapper: createQueryClientWrapper(),
      ...options,
    });
  });

  return renderResult!;
};
