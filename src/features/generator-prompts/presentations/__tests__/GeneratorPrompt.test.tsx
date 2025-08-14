import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GeneratorPrompt } from "../GeneratorPrompt";

// Mock react-hook-form
vi.mock("react-hook-form", () => ({
  useFormContext: () => ({
    register: () => ({}),
  }),
}));

// Mock @heroui/input
vi.mock("@heroui/input", () => ({
  Textarea: ({ label, className }: { label: string; className: string }) => (
    <div data-testid={`textarea-${label.toLowerCase()}`} className={className}>
      {label} Mock
    </div>
  ),
}));

describe("GeneratorPrompt", () => {
  it("should render prompt and negative prompt text areas", () => {
    render(<GeneratorPrompt />);

    // Check if the text areas are rendered
    const promptTextarea = screen.getByTestId("textarea-prompt");
    const negativePromptTextarea = screen.getByTestId("textarea-negative prompt");

    expect(promptTextarea).toBeInTheDocument();
    expect(promptTextarea).toHaveClass("font-mono");
    expect(promptTextarea).toHaveTextContent("Prompt Mock");

    expect(negativePromptTextarea).toBeInTheDocument();
    expect(negativePromptTextarea).toHaveClass("font-mono");
    expect(negativePromptTextarea).toHaveTextContent("Negative prompt Mock");
  });
});
