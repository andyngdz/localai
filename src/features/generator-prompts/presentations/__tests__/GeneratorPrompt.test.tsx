import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GeneratorPrompt } from "../GeneratorPrompt";

// Mock react-hook-form
vi.mock("react-hook-form", () => ({
  useFormContext: () => ({
    register: () => ({
      onChange: vi.fn(),
      onBlur: vi.fn(),
      name: "mock",
      ref: vi.fn(),
    }),
    formState: { errors: {} },
  }),
}));

// Mock @heroui/input
vi.mock("@heroui/input", () => ({
  Textarea: ({
    label,
    className,
    name,
    maxLength,
  }: {
    label: string;
    className: string;
    value?: string;
    onChange?: () => void;
    onBlur?: () => void;
    name?: string;
    maxLength?: number;
  }) => (
    <div
      data-testid={sanitizeLabelTestId(label)}
      className={className}
      data-name={name}
      data-maxlength={maxLength}
    >
      {label} Mock
    </div>
  ),
}));

// Helper to make test id generation explicit and easier to read
function sanitizeLabelTestId(label: string) {
  return `textarea-${label.toLowerCase().replace(/\s+/g, "-")}`;
}

describe("GeneratorPrompt", () => {
  it("should render prompt and negative prompt text areas", () => {
    render(<GeneratorPrompt />);

    // Check if the text areas are rendered
    const promptTextarea = screen.getByTestId("textarea-prompt");
    const negativePromptTextarea = screen.getByTestId("textarea-negative-prompt");

    expect(promptTextarea).toBeInTheDocument();
    expect(promptTextarea).toHaveClass("font-mono");
    expect(promptTextarea).toHaveTextContent("Prompt Mock");

    expect(negativePromptTextarea).toBeInTheDocument();
    expect(negativePromptTextarea).toHaveClass("font-mono");
    expect(negativePromptTextarea).toHaveTextContent("Negative prompt Mock");
  });
});
