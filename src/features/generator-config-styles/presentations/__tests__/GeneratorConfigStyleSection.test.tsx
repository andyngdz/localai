import { GeneratorConfigFormValues } from "@/features/generator-configs/types/generator-config";
import { StyleItem, StyleSection } from "@/types";
import { render, screen } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GeneratorConfigStyleSection } from "../GeneratorConfigStyleSection";

// Mock the GeneratorConfigStyleItem component
vi.mock("../GeneratorConfigStyleItem", () => ({
  GeneratorConfigStyleItem: ({ styleItem }: { styleItem: StyleItem }) => (
    <div data-testid={`style-item-${styleItem.id}`} data-style-name={styleItem.name}>
      {styleItem.name}
    </div>
  ),
}));

// Mock style sections data
const mockStyleSections: StyleSection[] = [
  {
    id: "anime",
    styles: [
      {
        id: "anime-style-1",
        name: "Anime Style 1",
        origin: "Anime Origin",
        license: "MIT",
        positive: "Anime style description 1",
        image: "anime1.jpg",
      },
      {
        id: "anime-style-2",
        name: "Anime Style 2",
        origin: "Anime Origin",
        license: "MIT",
        positive: "Anime style description 2",
        image: "anime2.jpg",
      },
    ],
  },
  {
    id: "realistic",
    styles: [
      {
        id: "realistic-style-1",
        name: "Realistic Style 1",
        origin: "Realistic Origin",
        license: "MIT",
        positive: "Realistic style description 1",
        image: "realistic1.jpg",
      },
    ],
  },
];

// Test wrapper component that provides form context
const TestWrapper = ({
  children,
  defaultValues,
}: {
  children: React.ReactNode;
  defaultValues?: Partial<GeneratorConfigFormValues>;
}) => {
  const methods = useForm<GeneratorConfigFormValues>({
    defaultValues: {
      width: 512,
      height: 512,
      hires_fix: false,
      number_of_images: 4,
      steps: 24,
      seed: -1,
      cfg_scale: 7.5,
      styles: [],
      ...defaultValues,
    },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe("GeneratorConfigStyleSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all style sections", () => {
    render(
      <TestWrapper>
        <GeneratorConfigStyleSection styleSections={mockStyleSections} />
      </TestWrapper>
    );

    expect(screen.getByText("anime")).toBeInTheDocument();
    expect(screen.getByText("realistic")).toBeInTheDocument();
  });

  it("renders section headers with proper styling", () => {
    render(
      <TestWrapper>
        <GeneratorConfigStyleSection styleSections={mockStyleSections} />
      </TestWrapper>
    );

    const animeHeader = screen.getByText("anime");
    const realisticHeader = screen.getByText("realistic");

    expect(animeHeader).toHaveClass(
      "text-lg",
      "font-medium",
      "capitalize",
      "bg-foreground-100",
      "p-2"
    );
    expect(realisticHeader).toHaveClass(
      "text-lg",
      "font-medium",
      "capitalize",
      "bg-foreground-100",
      "p-2"
    );
  });

  it("renders all style items within sections", () => {
    render(
      <TestWrapper>
        <GeneratorConfigStyleSection styleSections={mockStyleSections} />
      </TestWrapper>
    );

    // Check anime section styles
    expect(screen.getByTestId("style-item-anime-style-1")).toBeInTheDocument();
    expect(screen.getByTestId("style-item-anime-style-2")).toBeInTheDocument();
    expect(screen.getByText("Anime Style 1")).toBeInTheDocument();
    expect(screen.getByText("Anime Style 2")).toBeInTheDocument();

    // Check realistic section styles
    expect(screen.getByTestId("style-item-realistic-style-1")).toBeInTheDocument();
    expect(screen.getByText("Realistic Style 1")).toBeInTheDocument();
  });

  it("renders sections in correct order", () => {
    render(
      <TestWrapper>
        <GeneratorConfigStyleSection styleSections={mockStyleSections} />
      </TestWrapper>
    );

    const sections = screen.getAllByText(/anime|realistic/);
    expect(sections[0]).toHaveTextContent("anime");
    expect(sections[1]).toHaveTextContent("realistic");
  });

  it("renders style items in correct order within sections", () => {
    render(
      <TestWrapper>
        <GeneratorConfigStyleSection styleSections={mockStyleSections} />
      </TestWrapper>
    );

    const animeStyles = screen.getAllByTestId(/style-item-anime-style-/);
    expect(animeStyles[0]).toHaveAttribute("data-testid", "style-item-anime-style-1");
    expect(animeStyles[1]).toHaveAttribute("data-testid", "style-item-anime-style-2");
  });

  it("handles empty style sections array", () => {
    render(
      <TestWrapper>
        <GeneratorConfigStyleSection styleSections={[]} />
      </TestWrapper>
    );

    // Should render nothing when no sections
    expect(screen.queryByText(/anime|realistic/)).not.toBeInTheDocument();
  });

  it("handles sections with empty styles arrays", () => {
    const sectionsWithEmptyStyles: StyleSection[] = [
      {
        id: "empty-section",
        styles: [],
      },
    ];

    render(
      <TestWrapper>
        <GeneratorConfigStyleSection styleSections={sectionsWithEmptyStyles} />
      </TestWrapper>
    );

    expect(screen.getByText("empty-section")).toBeInTheDocument();
    // Should not render any style items
    expect(screen.queryByTestId(/style-item-/)).not.toBeInTheDocument();
  });

  it("applies proper CSS classes to section containers", () => {
    render(
      <TestWrapper>
        <GeneratorConfigStyleSection styleSections={mockStyleSections} />
      </TestWrapper>
    );

    const sectionContainers = screen.getAllByText(/anime|realistic/).map((el) => el.parentElement);

    sectionContainers.forEach((container) => {
      expect(container).toHaveClass("flex", "flex-col", "gap-2");
    });
  });

  it("applies proper CSS classes to style item containers", () => {
    render(
      <TestWrapper>
        <GeneratorConfigStyleSection styleSections={mockStyleSections} />
      </TestWrapper>
    );

    const styleItemContainers = screen.getAllByTestId(/style-item-/).map((el) => el.parentElement);

    styleItemContainers.forEach((container) => {
      expect(container).toHaveClass("flex", "flex-wrap", "gap-2", "p-2");
    });
  });

  it("capitalizes section IDs in display", () => {
    const sectionsWithLowercaseIds: StyleSection[] = [
      {
        id: "lowercase-section",
        styles: [
          {
            id: "style-1",
            name: "Style 1",
            origin: "Origin",
            license: "MIT",
            positive: "Description",
            image: "style1.jpg",
          },
        ],
      },
    ];

    render(
      <TestWrapper>
        <GeneratorConfigStyleSection styleSections={sectionsWithLowercaseIds} />
      </TestWrapper>
    );

    expect(screen.getByText("lowercase-section")).toBeInTheDocument();
  });

  it("passes correct props to GeneratorConfigStyleItem components", () => {
    render(
      <TestWrapper>
        <GeneratorConfigStyleSection styleSections={mockStyleSections} />
      </TestWrapper>
    );

    const animeStyle1 = screen.getByTestId("style-item-anime-style-1");
    expect(animeStyle1).toHaveAttribute("data-style-name", "Anime Style 1");

    const realisticStyle1 = screen.getByTestId("style-item-realistic-style-1");
    expect(realisticStyle1).toHaveAttribute("data-style-name", "Realistic Style 1");
  });
});
