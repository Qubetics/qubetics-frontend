import React from "react";
import { render, screen, act } from "@testing-library/react";
import { SerachingValueProvider, useSearchData } from "../searchingData";

// A test component that consumes the context
const TestComponent = () => {
  const { searchValue, setSearchValue, searchData, setSearchData } =
    useSearchData();

  return (
    <>
      <div data-testid="value">{searchValue}</div>
      <div data-testid="data">{JSON.stringify(searchData)}</div>

      {/* Buttons to update the state */}
      <button onClick={() => setSearchValue("hello")}>SetValue</button>
      <button onClick={() => setSearchData([1, 2, 3])}>SetData</button>
    </>
  );
};

describe("SerachingValueProvider", () => {
  test("renders default values", () => {
    render(
      <SerachingValueProvider>
        <TestComponent />
      </SerachingValueProvider>
    );

    expect(screen.getByTestId("value").textContent).toBe("");
    expect(screen.getByTestId("data").textContent).toBe("[]");
  });

  test("updates searchValue and searchData correctly", () => {
    render(
      <SerachingValueProvider>
        <TestComponent />
      </SerachingValueProvider>
    );

    // update searchValue
    act(() => {
      screen.getByText("SetValue").click();
    });
    expect(screen.getByTestId("value").textContent).toBe("hello");

    // update searchData
    act(() => {
      screen.getByText("SetData").click();
    });
    expect(screen.getByTestId("data").textContent).toBe("[1,2,3]");
  });
});
