import { api } from "@/services/api";
import { useModelRecommendationsQuery } from "@/services/queries";
import { socket, SocketEvents } from "@/sockets";
import { act, renderHook } from "@testing-library/react";
import { setupRouterMock } from "@/cores/test-utils";
import { useForm, UseFormReturn } from "react-hook-form";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ModelRecommendationFormProps } from "../../types";
import { useModelRecommendation } from "../useModelRecommendation";
import { Socket } from "socket.io-client";

vi.mock("@/services/api");
vi.mock("@/services/queries");
vi.mock("@/sockets", async (originalImport: () => Promise<Socket>) => {
  const actual = await originalImport();
  return {
    ...actual,
    socket: {
      on: vi.fn(),
      off: vi.fn(),
    },
    SocketEvents: {
      MODEL_LOAD_COMPLETED: "MODEL_LOAD_COMPLETED",
    },
  };
});
vi.mock("next/navigation", () => ({ useRouter: vi.fn() }));
// Simple direct mock for react-hook-form
vi.mock("react-hook-form", () => ({
  useForm: vi.fn(),
}));

describe("useModelRecommendation", () => {
  const setValue = vi.fn() as UseFormReturn<ModelRecommendationFormProps>["setValue"];
  const mockForm: Partial<UseFormReturn<ModelRecommendationFormProps>> = {
    setValue,
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    // Setup router mock with proper replace function
    await setupRouterMock();

    vi.mocked(useForm).mockReturnValue(mockForm as UseFormReturn<ModelRecommendationFormProps>);
  });

  it("should set default id from data", () => {
    vi.mocked(useModelRecommendationsQuery).mockReturnValue({
      data: { default_selected_id: "test-id" },
    } as ReturnType<typeof useModelRecommendationsQuery>);

    renderHook(() => useModelRecommendation());

    expect(setValue).toHaveBeenCalledWith("id", "test-id");
  });

  it("should call api.downloadModel on submit", async () => {
    vi.mocked(useModelRecommendationsQuery).mockReturnValue({
      data: {},
    } as ReturnType<typeof useModelRecommendationsQuery>);

    vi.mocked(api.downloadModel).mockResolvedValue({});

    const { result } = renderHook(() => useModelRecommendation());

    await act(async () => {
      await result.current.onSubmit({ id: "model-123" });
    });

    expect(api.downloadModel).toHaveBeenCalledWith("model-123");
  });

  it("should navigate to dashboard on MODEL_LOAD_COMPLETED and clean up on unmount", async () => {
    vi.mocked(useModelRecommendationsQuery).mockReturnValue({
      data: {},
    } as ReturnType<typeof useModelRecommendationsQuery>);

    // Set up router mock
    const { mockReplace } = await setupRouterMock();

    // Mock the socket.on and socket.off methods
    vi.spyOn(socket, "on").mockImplementation((event: string, cb: VoidFunction) => {
      if (event === SocketEvents.MODEL_LOAD_COMPLETED) {
        cb(); // Immediately call the callback to trigger navigation
      }
      return socket; // Return the socket object as per socket.io API
    });

    const { unmount } = renderHook(() => useModelRecommendation());

    // Check that navigation happened
    expect(mockReplace).toHaveBeenCalledWith("/dashboard");
    expect(socket.on).toHaveBeenCalledWith(SocketEvents.MODEL_LOAD_COMPLETED, expect.any(Function));

    // Unmount the hook to trigger cleanup
    unmount();

    // Verify that socket.off was called with the correct event
    expect(socket.off).toHaveBeenCalledWith(
      SocketEvents.MODEL_LOAD_COMPLETED,
      expect.any(Function)
    );
  });
});
