import CopyText from "../DoCopy/CopyText";
import "../contractDetailTabs/ContractDtlTabs.scss";

const ContractAbi = ({ contractDetailData }) => {
  let parseContractAbi = "{}";

  try {
    if (contractDetailData?.abi) {
      const abiString = contractDetailData.abi.toString();
      if (abiString) {
        parseContractAbi = JSON.parse(abiString);
      }
    }
  } catch (error) {
    console.error("Failed to parse ABI:", error);
  }

  const AbiData = JSON.stringify(parseContractAbi, null, 2).replace(
    /\\n/g,
    "<br>"
  );
  return (
    contractDetailData?.verificationType != -1 && (
      <div className="codeTabContent__sourceCode">
        <div className="head">
          <h3>Contract ABI</h3>
          <CopyText text={AbiData} />
        </div>
        <div className="content firstContent" style={{ maxHeight: "200px" }}>
          <ul>
            <pre style={{ whiteSpace: "nowrap" }}>{AbiData}</pre>
          </ul>
        </div>
      </div>
    )
  );
};

export default ContractAbi;
