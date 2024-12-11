import React from "react";

const CompilerMessage = ({ compilerMessage }) => {
  return (
    compilerMessage && (
      <div className="codeTabContent__sourceCode">
        <div className="head">
          <h3>Compiler Messages</h3>
        </div>
        <div className="content firstContent compilerOutput">
          <ul>
            {compilerMessage.map((errorMessage, index) => (
              <li key={index}>
                <pre
                  dangerouslySetInnerHTML={{
                    __html: errorMessage.replace(/\\n/g, "<br>"),
                  }}
                ></pre>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  );
};

export default CompilerMessage;
