import { act } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useMessageStore } from "../useMessageStores";

describe("useMessageStore", () => {
  beforeEach(() => {
    act(() => {
      useMessageStore.getState().reset();
    });
  });

  it("has initial state", () => {
    expect(useMessageStore.getState().message).toBe("");
  });

  it("setMessage updates the message", () => {
    act(() => {
      useMessageStore.getState().setMessage("Hello");
    });
    expect(useMessageStore.getState().message).toBe("Hello");
  });

  it("reset clears the message", () => {
    act(() => {
      useMessageStore.getState().setMessage("Hello");
      useMessageStore.getState().reset();
    });
    expect(useMessageStore.getState().message).toBe("");
  });
});
