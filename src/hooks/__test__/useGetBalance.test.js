import { renderHook, act } from "@testing-library/react";
import useGetBalance from "../useGetBalance";
import getQubeticsPrice from "@/services/getQubeticsPrice";
import { ethers, JsonRpcProvider } from "ethers";

// Mock service
jest.mock("@/services/getQubeticsPrice");

// Mock ethers provider
const mockFormatEther = jest.fn();

jest.mock("ethers", () => {
    const actual = jest.requireActual("ethers");
    return {
        ...actual,
        JsonRpcProvider: jest.fn(),
        formatEther: (...args) => mockFormatEther(...args),
    };
});

describe("useGetBalance Hook", () => {
    let mockProvider;

    beforeEach(() => {
        jest.clearAllMocks();
        mockFormatEther.mockClear();

        // create mock provider
        mockProvider = {
            getBalance: jest.fn(),
        };

        JsonRpcProvider.mockImplementation(() => mockProvider);
    });

    test("should not fetch if address or rpcUrl is missing", async () => {
        const { result } = renderHook(() => useGetBalance("", ""));

        expect(result.current.loading).toBe(false);
        expect(result.current.balance).toBe(null);
    });

    test("should fetch balance and usd price successfully", async () => {
        const address = "0x123";
        const rpcUrl = "https://test.rpc";

        mockProvider.getBalance.mockResolvedValue("1000000000000000000"); // 1 ETH
        mockFormatEther.mockReturnValue("1"); // balance in ether

        getQubeticsPrice.mockResolvedValue({
            data: 2, // price 2 USD
        });

        const { result } = renderHook(() => useGetBalance(address, rpcUrl));

        // loading should be true initially
        expect(result.current.loading).toBe(true);

        await act(async () => { });

        // final results
        expect(result.current.loading).toBe(false);
        expect(result.current.balance).toBe("1.0");
        expect(result.current.usdPrice).toBe("2.0000"); // 1 * 2
        expect(result.current.error).toBe(null);

        // provider called correctly
        expect(JsonRpcProvider).toHaveBeenCalledWith(rpcUrl);
        expect(mockProvider.getBalance).toHaveBeenCalledWith(address);
    });

    test("should handle errors properly", async () => {
        const address = "0x123";
        const rpcUrl = "https://test.rpc";

        mockProvider.getBalance.mockRejectedValue(new Error("RPC Error"));

        const { result } = renderHook(() => useGetBalance(address, rpcUrl));

        await act(async () => { });

        expect(result.current.balance).toBe(null);
        expect(result.current.usdPrice).toBe("");
        expect(result.current.error).toBeInstanceOf(Error);
        expect(result.current.loading).toBe(false);
    });

    test("should allow manual refetch using fetchBalance", async () => {
        const address = "0x123";
        const rpcUrl = "https://rpc";

        mockProvider.getBalance.mockResolvedValue("500000000000000000"); // 0.5 ETH
        mockFormatEther.mockReturnValue("0.5");
        getQubeticsPrice.mockResolvedValue({ data: 10 });

        const { result } = renderHook(() => useGetBalance(address, rpcUrl));

        await act(async () => { });

        expect(result.current.usdPrice).toBe("5.0000");

        // Change mock for second call
        mockProvider.getBalance.mockResolvedValue("2000000000000000000"); // 2 ETH
        mockFormatEther.mockReturnValue("2");
        getQubeticsPrice.mockResolvedValue({ data: 3 });

        await act(async () => {
            await result.current.fetchBalance();
        });

        expect(result.current.usdPrice).toBe("6.0000"); // 2 * 3
    });
});
