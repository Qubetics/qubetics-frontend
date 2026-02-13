import { LogsOption } from "@/constant/dropDownConstant";
import { capitalizeWord, noExponentsValue } from "@/utils/commonFunctions";
import { useState } from "react";
import CustomSelect from "../customSelect/CustomSelect";

export const EventLogsDex = ({ text, decodedLogs }) => {
  const [selectedVal, setSelectedVal] = useState("hex");
  const handleInputChange = (val) => {
    setSelectedVal(val);
  };
  const eventData = {
    // name: "Event Name",
    // type: "Event Type",
    value: "",
  };
  return (
    <span className="">
      {(text?.method && text?.method !== "N/A" && text?.topics) ||
      (decodedLogs && text?.topics) ? (
        <>
          {decodedLogs != undefined ? "" : capitalizeWord(text?.method)}
          {/* {capitalizeWord(text?.method)} */}
          {/* <br /> */}
          {text?.topics?.map((item, index) => (
            <p key={index}>
              {`[topic${index}]`}{" "}
              {selectedVal === "hex" ? item : noExponentsValue(item)}
            </p>
          ))}
          <div className="logsInnerSelect">
            <CustomSelect
              options={LogsOption}
              value={selectedVal}
              onChange={(value) => handleInputChange(value)}
              defaultValue={"HEX"}
            />
            {/* <HexDEx event={eventData} index={0} /> */}
          </div>
        </>
      ) : (
        "-"
      )}
    </span>
  );
};
