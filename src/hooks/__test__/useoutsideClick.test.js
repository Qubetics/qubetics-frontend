import { renderHook } from "@testing-library/react";
import useOnClickOutside from "../useoutsideClick";
import { act } from "react-dom/test-utils";

describe("useOnClickOutside Hook", () => {
  let handler;
  let ref;

  beforeEach(() => {
    handler = jest.fn();
    ref = { current: document.createElement("div") };
    document.body.appendChild(ref.current);
  });

  afterEach(() => {
    document.body.innerHTML = "";
    jest.clearAllMocks();
  });

  test("should call handler when clicking outside the element", () => {
    renderHook(() => useOnClickOutside(ref, handler));

    act(() => {
      document.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    });

    expect(handler).toHaveBeenCalledTimes(1);
  });

  test("should NOT call handler when clicking inside the element", () => {
    renderHook(() => useOnClickOutside(ref, handler));

    act(() => {
      ref.current.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    });

    expect(handler).not.toHaveBeenCalled();
  });

  test("should clean up event listeners on unmount", () => {
    const addSpy = jest.spyOn(document, "addEventListener");
    const removeSpy = jest.spyOn(document, "removeEventListener");

    const { unmount } = renderHook(() => useOnClickOutside(ref, handler));

    expect(addSpy).toHaveBeenCalledWith(
      "mousedown",
      expect.any(Function)
    );
    expect(addSpy).toHaveBeenCalledWith(
      "touchstart",
      expect.any(Function)
    );

    unmount();

    expect(removeSpy).toHaveBeenCalledWith(
      "mousedown",
      expect.any(Function)
    );
    expect(removeSpy).toHaveBeenCalledWith(
      "touchstart",
      expect.any(Function)
    );
  });

  test("should call handler on touchstart outside", () => {
    renderHook(() => useOnClickOutside(ref, handler));

    act(() => {
      document.dispatchEvent(
        new TouchEvent("touchstart", { bubbles: true })
      );
    });

    expect(handler).toHaveBeenCalledTimes(1);
  });
});
