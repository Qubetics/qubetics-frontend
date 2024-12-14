import { formatDate } from "@/utils/renderTime";

export const contractData = (contractDetailData) => [
  {
    contract: "Contract Name",
    Homer: contractDetailData?.contractname
      ? contractDetailData?.contractname
      : "-",
    name: "Compiler Version",
    data: contractDetailData?.compilerversion
      ? contractDetailData?.compilerversion
      : "-",
  },
  {
    contract: "EVM Version",
    Homer: contractDetailData?.evmVersion
      ? contractDetailData?.evmVersion
      : "-",
    name: "Optimization Enabled",
    data: contractDetailData?.optimizationUsed ? "True" : "False",
  },
  {
    contract: "Optimization Runs",
    Homer: contractDetailData?.runs ? contractDetailData?.runs : "-",
    name: "Verified At",
    data: contractDetailData?.createdAt
      ? formatDate(contractDetailData?.createdAt)
      : "",
  },
];

export const contractByteCode = (contractDetailData) => {
  const result = [];
  if (
    contractDetailData?.verificationType !== -1 &&
    contractDetailData?.creationCode
  ) {
    result.push({
      title: "Contract Creation Code",
      content: contractDetailData.creationCode || "",
    });
  }

  // Add Deployed ByteCode
  result.push({
    title: "Deployed ByteCode ",
    content: contractDetailData.byteCode || contractDetailData.bytecode || "",
  });

  return result;
};
