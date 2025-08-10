import { afterEach, describe, expect, it } from "vitest";
import { useModelSelectorStore } from "../useModelSelectorStores";

describe("useModelSelectorStore", () => {
  // Clear the store after each test
  afterEach(() => {
    useModelSelectorStore.setState({ id: "" });
  });

  it("should initialize with empty id", () => {
    const state = useModelSelectorStore.getState();
    expect(state.id).toBe("");
  });

  it("should update id when setId is called", () => {
    const state = useModelSelectorStore.getState();
    state.setId("test-model-id");

    const updatedState = useModelSelectorStore.getState();
    expect(updatedState.id).toBe("test-model-id");
  });

  it("should persist the state with proper name", () => {
    // This verifies that the persist middleware is configured correctly

    // Get the persist options from the store
    const persistOptions = useModelSelectorStore.persist?.getOptions();

    expect(persistOptions).toBeDefined();
    expect(persistOptions?.name).toBe("model-selector");
  });
});
