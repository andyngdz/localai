import { api } from "@/services/api";
import { useModelRecommendationsQuery } from "@/services/queries";
import { socket, SocketEvents } from "@/sockets";
import { act, renderHook } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { useForm, UseFormReturn } from "react-hook-form";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ModelRecommendationFormProps } from "../../types";
import { useModelRecommendation } from "../useModelRecommendation";

// Minimal router type for mocking
type MockRouter = {
  back: VoidFunction;
  forward: VoidFunction;
  refresh: VoidFunction;
  push: (url: string) => void;
  prefetch: (url: string) => Promise<void>;
  replace: (url: string) => void;
};

vi.mock("@/services/api");
vi.mock("@/services/queries");
vi.mock("@/sockets", () => {
  const actual = vi.importActual("@/sockets");
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
vi.mock("react-hook-form", async () => {
  const actual = await vi.importActual("react-hook-form");
  return {
    ...actual,
    useForm: vi.fn(),
  };
});

describe("useModelRecommendation", () => {
  const setValue =
    vi.fn() as UseFormReturn<ModelRecommendationFormProps>["setValue"];
  const replace = vi.fn() as (url: string) => void;
  // Provide a full mock for AppRouterInstance
  const mockRouter: MockRouter = {
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    push: vi.fn(),
    prefetch: vi.fn().mockResolvedValue({}),
    replace,
  };
  const mockForm: Partial<UseFormReturn<ModelRecommendationFormProps>> = {
    setValue,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useForm).mockReturnValue(
      mockForm as UseFormReturn<ModelRecommendationFormProps>
    );
    vi.mocked(useRouter).mockReturnValue(mockRouter);
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

  it("should navigate to dashboard on MODEL_LOAD_COMPLETED and clean up on unmount", () => {
    vi.mocked(useModelRecommendationsQuery).mockReturnValue({
      data: {},
    } as ReturnType<typeof useModelRecommendationsQuery>);

    // Mock the socket.on and socket.off methods
    vi.spyOn(socket, "on").mockImplementation(
      (event: string, cb: VoidFunction) => {
        if (event === SocketEvents.MODEL_LOAD_COMPLETED) {
          cb(); // Immediately call the callback to trigger navigation
        }
        return socket; // Return the socket object as per socket.io API
      }
    );

    const { unmount } = renderHook(() => useModelRecommendation());

    // Check that navigation happened
    expect(replace).toHaveBeenCalledWith("/dashboard");
    expect(socket.on).toHaveBeenCalledWith(
      SocketEvents.MODEL_LOAD_COMPLETED,
      expect.any(Function)
    );

    // Unmount the hook to trigger cleanup
    unmount();

    // Verify that socket.off was called with the correct event
    expect(socket.off).toHaveBeenCalledWith(
      SocketEvents.MODEL_LOAD_COMPLETED,
      expect.any(Function)
    );
  });
});
