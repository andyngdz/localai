import { GeneratorConfigFormValues } from "@/features/generator-configs/types/generator-config";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";
import { seedService } from "../../services/seed";
import { GeneratorConfigSeed } from "../GeneratorConfigSeed";

// Mock dependencies
vi.mock("@/cores/presentations/NumberInputController", () => ({
  NumberInputController: ({
    "aria-label": ariaLabel,
    controlName,
    startContent,
  }: {
    "aria-label": string;
    controlName: string;
    startContent: ReactNode;
    [key: string]: unknown;
  }) => (
    <div data-testid={`number-input-${controlName}`}>
      <span>{ariaLabel}</span>
      {startContent}
    </div>
  ),
}));

vi.mock("../../services/seed", () => ({
  seedService: {
    generate: vi.fn().mockReturnValue(12345),
  },
}));

const MockFormProvider = ({ children }: { children: ReactNode }) => {
  const methods = useForm<GeneratorConfigFormValues>({
    defaultValues: {
      width: 512,
      height: 512,
      hires_fix: false,
      number_of_images: 1,
      steps: 20,
      cfg_scale: 7,
      seed: 0,
    },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe("GeneratorConfigSeed", () => {
  it("should render the component with 'Seed' heading", () => {
    render(
      <MockFormProvider>
        <GeneratorConfigSeed />
      </MockFormProvider>
    );

    expect(screen.getByText("Seed", { selector: "span.font-semibold" })).toBeInTheDocument();
  });

  it("should render number input for seed value", () => {
    render(
      <MockFormProvider>
        <GeneratorConfigSeed />
      </MockFormProvider>
    );

    expect(screen.getByTestId("number-input-seed")).toBeInTheDocument();
    expect(screen.getByText("Value")).toBeInTheDocument();
  });

  it("should render a dice button to generate random seed", () => {
    render(
      <MockFormProvider>
        <GeneratorConfigSeed />
      </MockFormProvider>
    );

    // Check that a button is present
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBe(1); // Should be one button
  });

  it("should call seedService.generate and setValue when dice button is clicked", async () => {
    const user = userEvent.setup();
    const mockSetValue = vi.fn();

    // Create custom FormProvider with mock setValue
    const CustomMockFormProvider = ({ children }: { children: ReactNode }) => {
      const methods = useForm<GeneratorConfigFormValues>({
        defaultValues: {
          width: 512,
          height: 512,
          hires_fix: false,
          number_of_images: 1,
          steps: 20,
          cfg_scale: 7,
          seed: 0,
        },
      });

      // Override setValue with mock function
      methods.setValue = mockSetValue;

      return <FormProvider {...methods}>{children}</FormProvider>;
    };

    render(
      <CustomMockFormProvider>
        <GeneratorConfigSeed />
      </CustomMockFormProvider>
    );

    // Click on the dice button
    const diceButton = screen.getByRole("button");
    await user.click(diceButton);

    // Verify that seedService.generate was called
    expect(seedService.generate).toHaveBeenCalled();

    // Verify that setValue was called with the correct parameters
    expect(mockSetValue).toHaveBeenCalledWith(
      "seed",
      12345, // This is the mocked return value of seedService.generate
      { shouldValidate: true, shouldTouch: true }
    );
  });
});
