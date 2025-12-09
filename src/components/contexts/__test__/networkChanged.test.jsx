import React from "react";
import { renderHook, act } from "@testing-library/react";
import { NetworkProvider, useGetNetwork } from "../networkChanged";

describe("NetworkProvider Context", () => {
  const wrapper = ({ children }) => <NetworkProvider>{children}</NetworkProvider>;

  test("should provide default context values", () => {
    const { result } = renderHook(() => useGetNetwork(), { wrapper });

    expect(result.current.isNetworkChanged).toBe(false);
    expect(result.current.isEvm).toBe(true);

    expect(typeof result.current.setIsNetworkChanged).toBe("function");
    expect(typeof result.current.setIsEvm).toBe("function");
  });

  test("should update isNetworkChanged value", () => {
    const { result } = renderHook(() => useGetNetwork(), { wrapper });

    act(() => {
      result.current.setIsNetworkChanged(true);
    });

    expect(result.current.isNetworkChanged).toBe(true);
  });

  test("should update isEvm value", () => {
    const { result } = renderHook(() => useGetNetwork(), { wrapper });

    act(() => {
      result.current.setIsEvm(false);
    });

    expect(result.current.isEvm).toBe(false);
  });
});
