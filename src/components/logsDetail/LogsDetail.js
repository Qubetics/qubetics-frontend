import React from "react";
import "./LogsDetail.scss";
import { capitalizeWord } from "@/utils/commonFunctions";

function LogsDetail(data) {
  const { topics, contractLogs, index } = data;
  return (
    <div className="logDetail">
      <div className="logInner">
        <div className="ineerDetail">
          <h2>Address</h2>
          <p>{contractLogs?.address ?? "-"}</p>
        </div>
        <div className="ineerDetail">
          <h2>Name</h2>
          <p>{contractLogs?.name ?? "-"}</p>
        </div>
        <div className="ineerDetail">
          <h2>Topics</h2>
          <p>
            {index === 0 ? (
              <span>
                {/* {capitalizeWord(contractLogs?.method)} */}
                {/* <br /> */}
                {topics?.map((item, index) => (
                  <p key={index}>
                    {`[topic${index}]`} {item}
                  </p>
                ))}
              </span>
            ) : (
              "-"
            )}
          </p>
        </div>
        <div className="ineerDetail">
          <h2>Data</h2>
          <p>
            {contractLogs?.events.map((e, i) => {
              return (
                <span key={i + "data"}>
                  <p>
                    {e?.name} {e?.type} {e?.value.includes('0x') && e.type.includes("uint") ? Number(e?.value) : e?.value}
                  </p>
                  {/* <p>{e?.name}</p>
                <p>{e.type}</p>
                <p>{e.value}</p> */}
                </span>
              );
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

export default LogsDetail;
