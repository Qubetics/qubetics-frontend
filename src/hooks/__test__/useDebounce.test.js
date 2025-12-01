import { renderHook, act } from "@testing-library/react";
import useDebounce from "../useDebounce";

jest.useFakeTimers();

describe("useDebounce Hook", () => {
  test("should return initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 500));

    expect(result.current.debounce).toBe("hello");
  });

  test("should update debounce value after delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: "A" } }
    );

    expect(result.current.debounce).toBe("A");

    // update value
    rerender({ value: "B" });

    // still old value because delay not passed
    expect(result.current.debounce).toBe("A");

    // run timers after 500ms
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // now debounce value should update
    expect(result.current.debounce).toBe("B");
  });

  test("should clear previous timeout on new value", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "X" } }
    );

    rerender({ value: "Y" });

    act(() => {
      jest.advanceTimersByTime(100); // not enough time
    });

    // should NOT update yet
    expect(result.current.debounce).toBe("X");

    // change value again before delay finishes
    rerender({ value: "Z" });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    // debounced value should now be "Z"
    expect(result.current.debounce).toBe("Z");
  });
});
