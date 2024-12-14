import React from "react";
import { contractByteCode } from "../contractDetailTabs/ContractData";
import CopyText from "../DoCopy/CopyText";

const ByteCreationCode = ({ contractDetailData }) => {
  const byteCodeSnippets = contractByteCode(contractDetailData);
  return (
    <div>
      {byteCodeSnippets && byteCodeSnippets.length > 0 ? (
        byteCodeSnippets.map((snippet, index) => (
          <div key={index} className="codeTabContent__sourceCode">
            <div className="head">
              <h3>{snippet?.title}</h3>
              <div className="rightcontent">
                {/* <CopyText text={snippet?.content} /> */}
              </div>
            </div>
            <div className="content">
              <ul>
                <li>{snippet?.content}</li>
              </ul>
            </div>
          </div>
        ))
      ) : (
        <p>No byte code snippets available.</p>
      )}
    </div>
  );
};

export default ByteCreationCode;
