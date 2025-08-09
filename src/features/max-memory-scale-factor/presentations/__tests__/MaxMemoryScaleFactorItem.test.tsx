import { RadioGroup } from "@heroui/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryOption } from "../../types";
import { MaxMemoryScaleFactorItem } from "../MaxMemoryScaleFactorItem";

describe("MaxMemoryScaleFactorItem", () => {
  const renderComponent = (scaleFactor: number) => {
    const option: MemoryOption = {
      scaleFactor,
      label: `${scaleFactor * 100}%`,
    };
    return render(
      <RadioGroup defaultValue={scaleFactor.toString()}>
        <MaxMemoryScaleFactorItem option={option} />
      </RadioGroup>
    );
  };

  it("renders with success color for 0.5 scale factor", () => {
    const { container } = renderComponent(0.5);
    
    const percentage = screen.getByText("50% GPU / 50% RAM");
    expect(percentage).toBeInTheDocument();
    expect(percentage).toHaveClass("text-success/90");
    
    // Find the Card element by checking its class contains the bg-success/10
    const cardElements = container.querySelectorAll('[class*="bg-success"]');
    expect(cardElements.length).toBeGreaterThan(0);
  });

  it("renders with warning color for 0.6 scale factor", () => {
    const { container } = renderComponent(0.6);
    
    const percentage = screen.getByText("60% GPU / 60% RAM");
    expect(percentage).toBeInTheDocument();
    expect(percentage).toHaveClass("text-warning/90");
    
    // Find the Card element by checking its class contains the bg-warning/10
    const cardElements = container.querySelectorAll('[class*="bg-warning"]');
    expect(cardElements.length).toBeGreaterThan(0);
  });

  it("renders with danger color for 0.8 scale factor", () => {
    const { container } = renderComponent(0.8);
    
    const percentage = screen.getByText("80% GPU / 80% RAM");
    expect(percentage).toBeInTheDocument();
    expect(percentage).toHaveClass("text-danger/90");
    
    // Find the Card element by checking its class contains the bg-danger/10
    const cardElements = container.querySelectorAll('[class*="bg-danger"]');
    expect(cardElements.length).toBeGreaterThan(0);
  });

  it("renders radio button with correct value", () => {
    renderComponent(0.7);
    
    // Find the radio input
    const radio = screen.getByRole("radio") as HTMLInputElement;
    expect(radio).toBeInTheDocument();
    expect(radio.value).toBe("0.7");
  });
});
