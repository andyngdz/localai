import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Dashboard } from "../Dashboard";

describe("Dashboard", () => {
  it("renders dashboard component", () => {
    render(<Dashboard />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("renders as a div element", () => {
    const { container } = render(<Dashboard />);

    const dashboardDiv = container.firstChild;
    expect(dashboardDiv).toBeInTheDocument();
    expect(dashboardDiv).toHaveTextContent("Dashboard");
  });

  it("has correct component structure", () => {
    const { container } = render(<Dashboard />);

    // Should render a single div element
    expect(container.children).toHaveLength(1);
    expect(container.firstChild?.nodeName).toBe("DIV");
  });

  it("matches snapshot", () => {
    const { container } = render(<Dashboard />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
