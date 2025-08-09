import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DashboardScreen from "../page";

// Mock the Dashboard component
vi.mock("@/features/dashboard/presentations/Dashboard", () => ({
  Dashboard: () => <div data-testid="dashboard">Dashboard Component</div>,
}));

describe("DashboardScreen", () => {
  it("renders Dashboard component", () => {
    render(<DashboardScreen />);

    expect(screen.getByTestId("dashboard")).toBeInTheDocument();
    expect(screen.getByText("Dashboard Component")).toBeInTheDocument();
  });

  it("returns Dashboard as default export", () => {
    const { container } = render(<DashboardScreen />);

    expect(container.firstChild).toBeInTheDocument();
    expect(screen.getByTestId("dashboard")).toBeInTheDocument();
  });

  it("has correct component structure", () => {
    const { container } = render(<DashboardScreen />);

    // Should render only the Dashboard component
    expect(container.children).toHaveLength(1);
    expect(screen.getByTestId("dashboard")).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { container } = render(<DashboardScreen />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
