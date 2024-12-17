import { LogsOption } from "@/constant/dropDownConstant";
import { noExponentsValue } from "@/utils/commonFunctions";
import { useState } from "react";
import CustomSelect from "../customSelect/CustomSelect";
import "./LogsDetail.scss";
import { HexDEx } from "./HexDEx";

function LogsDetail(data) {
  const { topics, contractLogs, index } = data;
  const [selectedVal, setSelectedVal] = useState("hex");
  const handleInputChange = (val) => {
    setSelectedVal(val);
  };
  const getName = (data) => {
    if (data === undefined) return;
    const isLogArray = Array.isArray(data) ? data : [data];
    return isLogArray
      .map((entry) => {
        const { name, events } = entry;
        const formattedEvents = events
          .map(
            (event, index) =>
              `index_topic_${index + 1} ${event.type} ${event.name}`
          )
          .join(", ");
        return `${name} (${formattedEvents})`;
      })
      .join("\n");
  };

  return (
    <div className="logDetail">
      <div className="logInner">
        <div className="ineerDetail">
          <h2>Address</h2>
          <p>{contractLogs?.address ?? "-"}</p>
        </div>
        <div className="ineerDetail">
          <h2>Name</h2>
          <p>{getName(contractLogs)}</p>
        </div>
        <div className="ineerDetail">
          <h2>Topics</h2>
          <p>
            {index === 0 ? (
              <span className="logsInnerSelect">
                <CustomSelect
                  options={LogsOption}
                  value={selectedVal}
                  onChange={(value) => handleInputChange(value)}
                  defaultValue={"HEX"}
                />
                {/* {capitalizeWord(contractLogs?.method)} */}
                {/* <br /> */}
                <div>
                  {topics?.map((item, index) => (
                    <p key={index}>
                      {`[topic${index}]`}{" "}
                      {selectedVal === "hex"
                        ? item
                        : noExponentsValue(Number(item))}
                    </p>
                  ))}
                </div>
              </span>
            ) : (
              "-"
            )}
          </p>
        </div>
        <div className="ineerDetail">
          <h2></h2>
          <p>
            {contractLogs?.events
              ?.filter((e) => e.name !== "value")
              .map((e, i) => {
                return <HexDEx event={e} index={i} />;
              })}
          </p>
        </div>
        <div className="ineerDetail">
          <h2>Data</h2>
          <p>
            {contractLogs?.events
              ?.filter((e) => e.name === "value")
              .map((e, i) => {
                return (
                  <p>
                    {/* {e?.name} {e?.type}{" "} */}
                    {e?.value.includes("0x") && e.type.includes("uint")
                      ? Number(e?.value)
                      : e?.value}
                  </p>
                );
              })}
          </p>
        </div>
      </div>
    </div>
  );
}

export default LogsDetail;
