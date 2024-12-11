import React from "react";
import { contractData } from "../contractDetailTabs/ContractData";
import "../contractDetailTabs/ContractDtlTabs.scss";

const ContractNameData = ({ contractDetailData }) => {
  const showContractDetail = contractData(contractDetailData);

  return (
    <div>
      {showContractDetail && showContractDetail.length > 0 ? (
        showContractDetail.map((contractName, index) => (
          <div key={index} className="codeTabContent__contractName__inner">
            <div className="homer">
              <p>{contractName?.contract || "-"}</p>
              <span>{contractName?.Homer || "-"}</span>
            </div>
            <div className="homer">
              <p>{contractName?.name || "-"}</p>
              <span>{contractName?.data || "-"}</span>
            </div>
          </div>
        ))
      ) : (
        <p>No contract details available.</p>
      )}
    </div>
  );
};

export default ContractNameData;
