import React from "react";
import { DeviceSelection } from "@/cores/constants";
import {
  createMockQuery,
  renderWithAct,
  setupRouterMock,
} from "@/cores/test-utils";
import { api } from "@/services/api";
import * as queries from "@/services/queries";
import { HealthResponse } from "@/types/api";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { HealthCheck } from "../HealthCheck";

// Mock the modules
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("../../../layout/presentations/SetupLayout", () => ({
  SetupLayout: ({
    children,
    title,
    description,
    onNext,
    isNextDisabled,
  }: {
    children: React.ReactNode;
    title: string;
    description: string;
    onNext?: () => void;
    isNextDisabled?: boolean;
  }) => (
    <div data-testid="mock-setup-layout">
      <h1>{title}</h1>
      <p>{description}</p>
      <div>{children}</div>
      <button
        data-testid="next-button"
        onClick={onNext}
        disabled={isNextDisabled}
      >
        Next
      </button>
    </div>
  ),
}));

vi.mock("../HealthCheckContent", () => ({
  HealthCheckContent: ({ isHealthy }: { isHealthy: boolean }) => (
    <div data-testid="mock-health-check-content">
      {isHealthy ? "Healthy" : "Not Healthy"}
    </div>
  ),
}));

// Mock API and queries
vi.mock("@/services/api", () => ({
  api: {
    getDeviceIndex: vi.fn(),
  },
}));

describe("HealthCheck", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    vi.mocked(api.getDeviceIndex).mockResolvedValue({
      device_index: DeviceSelection.NOT_FOUND,
    });
  });

  // Helper to setup health query mock
  const setupHealthQueryMock = (data: HealthResponse | null) => {
    vi.spyOn(queries, "useHealthQuery").mockReturnValue(createMockQuery(data));
  };

  it("renders with correct title and description", async () => {
    // Mock the useHealthQuery hook to return healthy state
    setupHealthQueryMock({
      status: "ok",
      message: "Server is running",
    });

    await renderWithAct(<HealthCheck />);

    expect(screen.getByText("Health Check")).toBeInTheDocument();
    expect(
      screen.getByText("Checking the connection to your LocalAI backend server")
    ).toBeInTheDocument();
  });

  it("renders HealthCheckContent with isHealthy=true when backend is healthy", async () => {
    // Mock the useHealthQuery hook to return healthy state
    setupHealthQueryMock({
      status: "ok",
      message: "Server is running",
    });

    await renderWithAct(<HealthCheck />);

    const content = screen.getByTestId("mock-health-check-content");
    expect(content).toHaveTextContent("Healthy");
  });

  it("renders HealthCheckContent with isHealthy=false when backend is not healthy", async () => {
    // Mock the useHealthQuery hook to return null data (not healthy)
    setupHealthQueryMock(null);

    await renderWithAct(<HealthCheck />);

    const content = screen.getByTestId("mock-health-check-content");
    expect(content).toHaveTextContent("Not Healthy");
  });

  it("enables the Next button when backend is healthy", async () => {
    // Mock the useHealthQuery hook to return healthy state
    setupHealthQueryMock({
      status: "ok",
      message: "Server is running",
    });

    await renderWithAct(<HealthCheck />);

    const nextButton = screen.getByTestId("next-button");
    expect(nextButton).not.toBeDisabled();
  });

  it("disables the Next button when backend is not healthy", async () => {
    // Mock the useHealthQuery hook to return null data (not healthy)
    setupHealthQueryMock(null);

    await renderWithAct(<HealthCheck />);

    const nextButton = screen.getByTestId("next-button");
    expect(nextButton).toBeDisabled();
  });

  it("checks device index on mount", async () => {
    // Mock the useHealthQuery hook
    setupHealthQueryMock({
      status: "ok",
      message: "Server is running",
    });

    await renderWithAct(<HealthCheck />);

    expect(api.getDeviceIndex).toHaveBeenCalledTimes(1);
  });

  it("redirects to dashboard if device index is already set", async () => {
    // Mock getDeviceIndex to return a valid device index
    vi.mocked(api.getDeviceIndex).mockResolvedValue({ device_index: 0 });

    // Mock router
    const { mockPush } = await setupRouterMock();

    // Mock the useHealthQuery hook
    setupHealthQueryMock({
      status: "ok",
      message: "Server is running",
    });

    await renderWithAct(<HealthCheck />);

    // Use flush promises to wait for the async operation
    await vi.waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });
});
