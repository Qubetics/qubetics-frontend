import React from "react";
import CopyText from "../DoCopy/CopyText";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs } from "react-syntax-highlighter/dist/esm/styles/prism";

const SourceCode = ({ contractDetailData }) => {
  const getFile = contractDetailData?.sourcecode?.sources
    ? Object.keys(contractDetailData?.sourcecode?.sources)
    : [];
  const getContent = contractDetailData?.sourcecode?.sources
    ? Object.values(contractDetailData?.sourcecode?.sources)
    : [];

  return (
    contractDetailData?.verificationType !== -1 &&
    getContent && (
      <div className="codeTabContent__sourceCode">
        <div className="head">
          <h3>
            Contract source code <span>(Solidity)</span>
          </h3>
        </div>
        {getContent.map((res, index) => (
          <React.Fragment key={index}>
            <div className="copyData">
              <h4 >File: {getFile[index]}</h4>
              <CopyText text={res.content} />
            </div>

            <div className="content firstContent">
              <ul>
                {res && res.content && (
                  <li>
                    <SyntaxHighlighter language="solidity" style={vs}>
                      {res.content}
                    </SyntaxHighlighter>
                  </li>
                )}
              </ul>
            </div>
          </React.Fragment>
        ))}
      </div>
    )
  );
};

export default SourceCode;
