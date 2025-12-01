/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FilterResult from "../FilterResult.jsx";
import useGlobalSearch from "@/hooks/useGlobalSearch";
import { useRouter } from "next/navigation";
import "@testing-library/jest-dom";

// Mock hooks
jest.mock("@/hooks/useGlobalSearch");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("@/hooks/useoutsideClick", () => jest.fn());

// Mock SVG icons
jest.mock("../../../../public/SvgIcons", () => ({
  BlockIcon: () => <div data-testid="block-icon">BlockIcon</div>,
  Searchicon: () => <div data-testid="search-icon">SearchIcon</div>,
  EnterKeyIcon: () => <div>EnterKey</div>,
  NavigateDown: () => <div>Down</div>,
  NavigateUp: () => <div>Up</div>,
}));

// Mock Page component
jest.mock("@/app/(routes)/notfound/page", () => () => <div>Not Found Page</div>);

// Mock Link component
jest.mock("next/link", () => {
  return ({ children, href, onClick, className }) => (
    <a href={href} onClick={onClick} className={className}>
      {children}
    </a>
  );
});

describe("FilterResult Component", () => {
  const mockPush = jest.fn();
  const mockSetSearchText = jest.fn();
  const mockSetIsLoading = jest.fn();
  const mockSetDynamicTab = jest.fn();
  const mockSetSearchResult = jest.fn();

  const defaultMockValues = {
    searchText: "",
    setSearchText: mockSetSearchText,
    isLoading: false,
    setIsLoading: mockSetIsLoading,
    searchResult: null,
    dynamicTab: [],
    setDynamicTab: mockSetDynamicTab,
    setSearchResult: mockSetSearchResult,
    err: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ push: mockPush });
    useGlobalSearch.mockReturnValue(defaultMockValues);
    
    // Mock IntersectionObserver
    global.IntersectionObserver = jest.fn().mockImplementation((callback) => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));

    // Mock scrollTo
    Element.prototype.scrollTo = jest.fn();
    window.scrollTo = jest.fn();
  });

  test("renders search input", () => {
    render(<FilterResult />);
    const input = screen.getByPlaceholderText(/Search By Tx Hash/i);
    expect(input).toBeInTheDocument();
  });

  test("handles input change", () => {
    render(<FilterResult />);
    const input = screen.getByPlaceholderText(/Search By Tx Hash/i);
    
    fireEvent.change(input, { target: { value: "  test  " } });
    
    expect(mockSetSearchText).toHaveBeenCalledWith("test");
    expect(mockSetIsLoading).toHaveBeenCalledWith(true);
  });

  test("opens dropdown when input is focused with text", () => {
    useGlobalSearch.mockReturnValue({
      ...defaultMockValues,
      searchText: "test",
    });

    render(<FilterResult />);
    const input = screen.getByPlaceholderText(/Search By Tx Hash/i);
    
    fireEvent.focus(input);
    
    // Dropdown should be visible
    expect(screen.getByText("Navigate")).toBeInTheDocument();
  });

  test("renders tabs when dynamicTab has data", () => {
    useGlobalSearch.mockReturnValue({
      ...defaultMockValues,
      searchText: "test",
      dynamicTab: ["transaction", "block", "account"],
      searchResult: {
        results: {
          transaction: [],
          block: [],
          account: [],
        },
      },
    });

    render(<FilterResult />);
    const input = screen.getByPlaceholderText(/Search By Tx Hash/i);
    fireEvent.focus(input);

    const tabs = screen.getAllByText("Transaction");
    expect(tabs[0]).toBeInTheDocument(); // Tab button
    const blockTabs = screen.getAllByText("Block");
    expect(blockTabs[0]).toBeInTheDocument(); // Tab button
    const accountTabs = screen.getAllByText("Account");
    expect(accountTabs[0]).toBeInTheDocument(); // Tab button
  });

  test("renders search results", () => {
    useGlobalSearch.mockReturnValue({
      ...defaultMockValues,
      searchText: "test",
      dynamicTab: ["transaction"],
      searchResult: {
        results: {
          transaction: [
            { address: "0x123", name: "Test Transaction" },
          ],
        },
      },
    });

    render(<FilterResult />);
    const input = screen.getByPlaceholderText(/Search By Tx Hash/i);
    fireEvent.focus(input);

    expect(screen.getByText("0x123")).toBeInTheDocument();
  });

  test("handles tab click", () => {
    useGlobalSearch.mockReturnValue({
      ...defaultMockValues,
      searchText: "test",
      dynamicTab: ["transaction", "block"],
      searchResult: {
        results: {
          transaction: [{ address: "0x123" }],
          block: [{ address: "100" }],
        },
      },
    });

    render(<FilterResult />);
    const input = screen.getByPlaceholderText(/Search By Tx Hash/i);
    fireEvent.focus(input);

    // Get the button specifically (first occurrence)
    const blockTabs = screen.getAllByText("Block");
    const blockTab = blockTabs[0]; // The button
    fireEvent.click(blockTab);

    expect(blockTab.className).toContain("active-tab");
  });

  test("handles Escape key to close dropdown", () => {
    useGlobalSearch.mockReturnValue({
      ...defaultMockValues,
      searchText: "test",
      dynamicTab: ["transaction"],
    });

    render(<FilterResult />);
    const input = screen.getByPlaceholderText(/Search By Tx Hash/i);
    fireEvent.focus(input);

    fireEvent.keyDown(input, { key: "Escape" });
    
    // Dropdown should close
    expect(screen.queryByText("Navigate")).not.toBeInTheDocument();
  });

  test("handles Enter key navigation for transaction", () => {
    useGlobalSearch.mockReturnValue({
      ...defaultMockValues,
      searchText: "test",
      dynamicTab: ["transaction"],
      searchResult: {
        results: {
          transaction: [{ address: "0xabc123" }],
        },
      },
    });

    render(<FilterResult />);
    const input = screen.getByPlaceholderText(/Search By Tx Hash/i);
    fireEvent.focus(input);

    fireEvent.keyDown(input, { key: "Enter" });

    expect(mockPush).toHaveBeenCalledWith("/tx/0xabc123");
  });

  test("handles Enter key navigation for block", () => {
    useGlobalSearch.mockReturnValue({
      ...defaultMockValues,
      searchText: "test",
      dynamicTab: ["block"],
      searchResult: {
        results: {
          block: [{ address: "12345" }],
        },
      },
    });

    render(<FilterResult />);
    const input = screen.getByPlaceholderText(/Search By Tx Hash/i);
    fireEvent.focus(input);

    fireEvent.keyDown(input, { key: "Enter" });

    expect(mockPush).toHaveBeenCalledWith("/blocks/12345");
  });

  test("handles Enter key navigation for contract", () => {
    useGlobalSearch.mockReturnValue({
      ...defaultMockValues,
      searchText: "test",
      dynamicTab: ["contract"],
      searchResult: {
        results: {
          contract: [{ contractAddress: "0xcontract" }],
        },
      },
    });

    render(<FilterResult />);
    const input = screen.getByPlaceholderText(/Search By Tx Hash/i);
    fireEvent.focus(input);

    fireEvent.keyDown(input, { key: "Enter" });

    expect(mockPush).toHaveBeenCalledWith("/contract/0xcontract");
  });

  test("handles Enter key navigation for account", () => {
    useGlobalSearch.mockReturnValue({
      ...defaultMockValues,
      searchText: "test",
      dynamicTab: ["account"],
      searchResult: {
        results: {
          account: [{ address: "0xaccount" }],
        },
      },
    });

    render(<FilterResult />);
    const input = screen.getByPlaceholderText(/Search By Tx Hash/i);
    fireEvent.focus(input);

    fireEvent.keyDown(input, { key: "Enter" });

    expect(mockPush).toHaveBeenCalledWith("/account/0xaccount");
  });

  test("handles Enter key navigation for intentList", () => {
    useGlobalSearch.mockReturnValue({
      ...defaultMockValues,
      searchText: "test",
      dynamicTab: ["intentList"],
      searchResult: {
        results: {
          intentList: [{ address: "0xintent" }],
        },
      },
    });

    render(<FilterResult />);
    const input = screen.getByPlaceholderText(/Search By Tx Hash/i);
    fireEvent.focus(input);

    fireEvent.keyDown(input, { key: "Enter" });

    expect(mockPush).toHaveBeenCalledWith("/chain-abstraction/0xintent");
  });

  test("handles ArrowDown navigation", () => {
    useGlobalSearch.mockReturnValue({
      ...defaultMockValues,
      searchText: "test",
      dynamicTab: ["transaction"],
      searchResult: {
        results: {
          transaction: [{ address: "0x1" }, { address: "0x2" }],
        },
      },
    });

    render(<FilterResult />);
    const input = screen.getByPlaceholderText(/Search By Tx Hash/i);
    fireEvent.focus(input);

    fireEvent.keyDown(input, { key: "ArrowDown" });
    
    // Should focus on dropdown
    const dropdown = screen.getByText("Navigate").closest('div[tabindex="0"]');
    expect(dropdown).toBeInTheDocument();
  });

  test("does not navigate on Enter when no search text", () => {
    useGlobalSearch.mockReturnValue({
      ...defaultMockValues,
      searchText: "",
    });

    render(<FilterResult />);
    const input = screen.getByPlaceholderText(/Search By Tx Hash/i);

    fireEvent.keyDown(input, { key: "Enter" });

    expect(mockPush).not.toHaveBeenCalled();
  });

  test("does not navigate on Enter when loading", () => {
    useGlobalSearch.mockReturnValue({
      ...defaultMockValues,
      searchText: "test",
      isLoading: true,
    });

    render(<FilterResult />);
    const input = screen.getByPlaceholderText(/Search By Tx Hash/i);

    fireEvent.keyDown(input, { key: "Enter" });

    expect(mockPush).not.toHaveBeenCalled();
  });

  test("does not navigate on Enter when no results", () => {
    useGlobalSearch.mockReturnValue({
      ...defaultMockValues,
      searchText: "test",
      dynamicTab: ["transaction"],
      searchResult: {
        results: {
          transaction: [],
        },
      },
    });

    render(<FilterResult />);
    const input = screen.getByPlaceholderText(/Search By Tx Hash/i);
    fireEvent.focus(input);

    fireEvent.keyDown(input, { key: "Enter" });

    expect(mockPush).not.toHaveBeenCalled();
  });

  test("renders error page when err is present", () => {
    useGlobalSearch.mockReturnValue({
      ...defaultMockValues,
      searchText: "test",
      err: "Error occurred",
    });

    render(<FilterResult />);
    const input = screen.getByPlaceholderText(/Search By Tx Hash/i);
    fireEvent.focus(input);

    expect(screen.getByText("Not Found Page")).toBeInTheDocument();
  });

  test("renders token with name and symbol", () => {
    useGlobalSearch.mockReturnValue({
      ...defaultMockValues,
      searchText: "test",
      dynamicTab: ["tokens"],
      searchResult: {
        results: {
          tokens: [
            {
              address: "0xtoken",
              tokenName: "TestToken",
              tokenSymbol: "TT",
              price: "$100",
            },
          ],
        },
      },
    });

    render(<FilterResult />);
    const input = screen.getByPlaceholderText(/Search By Tx Hash/i);
    fireEvent.focus(input);

    expect(screen.getByText(/TestToken/)).toBeInTheDocument();
    expect(screen.getByText(/TT/)).toBeInTheDocument();
  });

  test("handles link click to close dropdown", () => {
    useGlobalSearch.mockReturnValue({
      ...defaultMockValues,
      searchText: "test",
      dynamicTab: ["transaction"],
      searchResult: {
        results: {
          transaction: [{ address: "0x123" }],
        },
      },
    });

    render(<FilterResult />);
    const input = screen.getByPlaceholderText(/Search By Tx Hash/i);
    fireEvent.focus(input);

    const link = screen.getByText("0x123").closest("a");
    fireEvent.click(link);

    // Dropdown should close
    expect(screen.queryByText("Navigate")).not.toBeInTheDocument();
  });

  test("handles ArrowDown navigation in dropdown", () => {
    useGlobalSearch.mockReturnValue({
      ...defaultMockValues,
      searchText: "test",
      dynamicTab: ["transaction"],
      searchResult: {
        results: {
          transaction: [{ address: "0x1" }, { address: "0x2" }],
        },
      },
    });

    render(<FilterResult />);
    const input = screen.getByPlaceholderText(/Search By Tx Hash/i);
    fireEvent.focus(input);

    const dropdown = screen.getByText("Navigate").closest('div[tabindex="0"]');
    fireEvent.keyDown(dropdown, { key: "ArrowDown" });

    // Should navigate to next item
    expect(dropdown).toBeInTheDocument();
  });

  test("handles ArrowUp navigation in dropdown", () => {
    useGlobalSearch.mockReturnValue({
      ...defaultMockValues,
      searchText: "test",
      dynamicTab: ["transaction", "block"],
      searchResult: {
        results: {
          transaction: [{ address: "0x1" }],
          block: [{ address: "100" }],
        },
      },
    });

    render(<FilterResult />);
    const input = screen.getByPlaceholderText(/Search By Tx Hash/i);
    fireEvent.focus(input);

    const dropdown = screen.getByText("Navigate").closest('div[tabindex="0"]');
    fireEvent.keyDown(dropdown, { key: "ArrowUp" });

    // Should handle up navigation
    expect(dropdown).toBeInTheDocument();
  });

  test("handles ArrowDown to switch tabs when at end of list", () => {
    useGlobalSearch.mockReturnValue({
      ...defaultMockValues,
      searchText: "test",
      dynamicTab: ["transaction", "block"],
      searchResult: {
        results: {
          transaction: [{ address: "0x1" }],
          block: [{ address: "100" }],
        },
      },
    });

    render(<FilterResult />);
    const input = screen.getByPlaceholderText(/Search By Tx Hash/i);
    fireEvent.focus(input);

    const dropdown = screen.getByText("Navigate").closest('div[tabindex="0"]');
    // Navigate down twice to reach end and switch tab
    fireEvent.keyDown(dropdown, { key: "ArrowDown" });
    fireEvent.keyDown(dropdown, { key: "ArrowDown" });

    expect(dropdown).toBeInTheDocument();
  });

  test("handles Enter key in dropdown to redirect", () => {
    useGlobalSearch.mockReturnValue({
      ...defaultMockValues,
      searchText: "test",
      dynamicTab: ["transaction"],
      searchResult: {
        results: {
          transaction: [{ address: "0xabc" }],
        },
      },
    });

    render(<FilterResult />);
    const input = screen.getByPlaceholderText(/Search By Tx Hash/i);
    fireEvent.focus(input);

    const dropdown = screen.getByText("Navigate").closest('div[tabindex="0"]');
    fireEvent.keyDown(dropdown, { key: "Enter" });

    expect(mockPush).toHaveBeenCalledWith("/tx/0xabc");
  });

  test("handles Escape key in dropdown", () => {
    useGlobalSearch.mockReturnValue({
      ...defaultMockValues,
      searchText: "test",
      dynamicTab: ["transaction"],
      searchResult: {
        results: {
          transaction: [{ address: "0xabc" }],
        },
      },
    });

    render(<FilterResult />);
    const input = screen.getByPlaceholderText(/Search By Tx Hash/i);
    fireEvent.focus(input);

    const dropdown = screen.getByText("Navigate").closest('div[tabindex="0"]');
    fireEvent.keyDown(dropdown, { key: "Escape" });

    // Dropdown should close
    expect(screen.queryByText("Navigate")).not.toBeInTheDocument();
  });

  test("handles navigation for tokens tab", () => {
    useGlobalSearch.mockReturnValue({
      ...defaultMockValues,
      searchText: "test",
      dynamicTab: ["tokens"],
      searchResult: {
        results: {
          tokens: [{ address: "0xtoken" }],
        },
      },
    });

    render(<FilterResult />);
    const input = screen.getByPlaceholderText(/Search By Tx Hash/i);
    fireEvent.focus(input);

    fireEvent.keyDown(input, { key: "Enter" });

    expect(mockPush).toHaveBeenCalledWith("/contract/0xtoken");
  });

  test("handles navigation for contracts tab", () => {
    useGlobalSearch.mockReturnValue({
      ...defaultMockValues,
      searchText: "test",
      dynamicTab: ["contracts"],
      searchResult: {
        results: {
          contracts: [{ contractAddress: "0xcontract" }],
        },
      },
    });

    render(<FilterResult />);
    const input = screen.getByPlaceholderText(/Search By Tx Hash/i);
    fireEvent.focus(input);

    fireEvent.keyDown(input, { key: "Enter" });

    expect(mockPush).toHaveBeenCalledWith("/contract/0xcontract");
  });

  test("handles navigation for transactions tab", () => {
    useGlobalSearch.mockReturnValue({
      ...defaultMockValues,
      searchText: "test",
      dynamicTab: ["transactions"],
      searchResult: {
        results: {
          transactions: [{ address: "0xaddr" }],
        },
      },
    });

    render(<FilterResult />);
    const input = screen.getByPlaceholderText(/Search By Tx Hash/i);
    fireEvent.focus(input);

    fireEvent.keyDown(input, { key: "Enter" });

    expect(mockPush).toHaveBeenCalledWith("/address/0xaddr");
  });

  test("handles default navigation for unknown tab", () => {
    useGlobalSearch.mockReturnValue({
      ...defaultMockValues,
      searchText: "test",
      dynamicTab: ["unknown"],
      searchResult: {
        results: {
          unknown: [{ address: "0xdefault" }],
        },
      },
    });

    render(<FilterResult />);
    const input = screen.getByPlaceholderText(/Search By Tx Hash/i);
    fireEvent.focus(input);

    fireEvent.keyDown(input, { key: "Enter" });

    expect(mockPush).toHaveBeenCalledWith("/address/0xdefault");
  });

  test("does not open dropdown when searchText is empty on focus", () => {
    useGlobalSearch.mockReturnValue({
      ...defaultMockValues,
      searchText: "",
    });

    render(<FilterResult />);
    const input = screen.getByPlaceholderText(/Search By Tx Hash/i);
    fireEvent.focus(input);

    expect(screen.queryByText("Navigate")).not.toBeInTheDocument();
  });

  test("handles empty input change", () => {
    render(<FilterResult />);
    const input = screen.getByPlaceholderText(/Search By Tx Hash/i);
    
    fireEvent.change(input, { target: { value: "   " } });
    
    // Should not set search text for whitespace only
    expect(mockSetSearchText).toHaveBeenCalledWith("");
  });
});
