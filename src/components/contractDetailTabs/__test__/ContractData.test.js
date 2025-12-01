import { contractData, contractByteCode } from ".././ContractData";
import { formatDate } from "@/utils/renderTime";

jest.mock("@/utils/renderTime", () => ({
  formatDate: jest.fn(() => "formatted-date"),
}));

describe("contractData()", () => {
  test("returns correct data when all fields are present", () => {
    const mock = {
      contractname: "MyContract",
      compilerversion: "v1.0.0",
      evmVersion: "london",
      optimizationUsed: true,
      runs: 200,
      createdAt: "2024-10-10",
    };

    const result = contractData(mock);

    expect(result).toEqual([
      {
        contract: "Contract Name",
        Homer: "MyContract",
        name: "Compiler Version",
        data: "v1.0.0",
      },
      {
        contract: "EVM Version",
        Homer: "london",
        name: "Optimization Enabled",
        data: "True",
      },
      {
        contract: "Optimization Runs",
        Homer: 200,
        name: "Verified At",
        data: "formatted-date",
      },
    ]);

    expect(formatDate).toHaveBeenCalledWith("2024-10-10");
  });

  test("returns default values when fields are missing", () => {
    const mock = {}; // empty object

    const result = contractData(mock);

    expect(result).toEqual([
      {
        contract: "Contract Name",
        Homer: "-",
        name: "Compiler Version",
        data: "-",
      },
      {
        contract: "EVM Version",
        Homer: "-",
        name: "Optimization Enabled",
        data: "False",
      },
      {
        contract: "Optimization Runs",
        Homer: "-",
        name: "Verified At",
        data: "",
      },
    ]);
  });
});

describe("contractByteCode()", () => {
  test("includes creation code when verificationType != -1 and creationCode exists", () => {
    const mock = {
      verificationType: 1,
      creationCode: "0x123",
      byteCode: "0x456",
    };

    const result = contractByteCode(mock);

    expect(result).toEqual([
      {
        title: "Contract Creation Code",
        content: "0x123",
      },
      {
        title: "Deployed Bytecode",
        content: "0x456",
      },
    ]);
  });

  test("does NOT include creation code when verificationType = -1", () => {
    const mock = {
      verificationType: -1,
      creationCode: "0x123",
      byteCode: "0x456",
    };

    const result = contractByteCode(mock);

    expect(result).toEqual([
      {
        title: "Deployed Bytecode",
        content: "0x456",
      },
    ]);
  });

  test("uses bytecode fallback when byteCode missing", () => {
    const mock = {
      verificationType: -1,
      bytecode: "0x999",
    };

    const result = contractByteCode(mock);

    expect(result).toEqual([
      {
        title: "Deployed Bytecode",
        content: "0x999",
      },
    ]);
  });

  test("handles undefined input safely", () => {
    const result = contractByteCode(undefined);

    expect(result).toEqual([
      {
        title: "Deployed Bytecode",
        content: "",
      },
    ]);
  });
});
