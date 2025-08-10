import { GeneratorConfigFormValues } from "@/features/generator-configs/types/generator-config";
import { render, screen } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";
import { GeneratorConfigSampling } from "../GeneratorConfigSampling";

// Mock the NumberInputController component
vi.mock("@/cores/presentations/NumberInputController", () => ({
  NumberInputController: ({
    controlName,
    startContent,
    minValue,
    maximumFractionDigits,
    "aria-label": ariaLabel,
  }: {
    controlName: string;
    startContent: React.ReactNode;
    minValue?: number;
    maximumFractionDigits?: number;
    "aria-label"?: string;
  }) => (
    <div data-testid={`number-input-${controlName}`}>
      <div>{startContent}</div>
      <input
        type="number"
        aria-label={ariaLabel}
        data-testid={`input-${controlName}`}
        min={minValue}
        step={maximumFractionDigits ? 1 / Math.pow(10, maximumFractionDigits) : 1}
      />
    </div>
  ),
}));

// Mock the GeneratorConfigCommonSteps component
vi.mock("../GeneratorConfigCommonSteps", () => ({
  GeneratorConfigCommonSteps: () => <div data-testid="common-steps" />,
}));

describe("GeneratorConfigSampling", () => {
  const Wrapper = () => {
    const methods = useForm<GeneratorConfigFormValues>({
      defaultValues: {
        steps: 20,
        cfg_scale: 7.5,
      },
    });

    return (
      <FormProvider {...methods}>
        <GeneratorConfigSampling />
      </FormProvider>
    );
  };

  it("renders the sampling section with correct title", () => {
    render(<Wrapper />);
    expect(screen.getByText("Sampling")).toBeInTheDocument();
  });

  it("renders the steps input with correct properties", () => {
    render(<Wrapper />);
    const stepsInput = screen.getByTestId("number-input-steps");
    expect(stepsInput).toBeInTheDocument();
    expect(screen.getByText("Steps")).toBeInTheDocument();
  });

  it("renders the common steps component", () => {
    render(<Wrapper />);
    expect(screen.getByTestId("common-steps")).toBeInTheDocument();
  });

  it("renders the CFG Scale input with correct properties", () => {
    render(<Wrapper />);
    const cfgScaleInput = screen.getByTestId("number-input-cfg_scale");
    expect(cfgScaleInput).toBeInTheDocument();
    expect(screen.getByText("CFG Scale")).toBeInTheDocument();
  });
});
