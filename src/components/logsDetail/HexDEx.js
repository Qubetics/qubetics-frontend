import React, { useState } from "react";
import CustomSelect from "../customSelect/CustomSelect";
import { LogsOption } from "@/constant/dropDownConstant";
import { noExponentsValue } from "@/utils/commonFunctions";

export const HexDEx = ({ event, index }) => {
  const [selectedVal, setSelectedVal] = useState("hex");
  const handleInputChange = (val) => {
    setSelectedVal(val);
  };
  return (
    <span key={index + "data"} className="logsInnerSelect">
      <p>
        {event?.name} {event?.type}
      </p>
      <CustomSelect
        options={LogsOption}
        value={selectedVal}
        onChange={(value) => handleInputChange(value)}
        defaultValue={"HEX"}
      />
      <div>
        <p>
          {/* {e?.name} {e?.type}{" "} */}
          {selectedVal === "hex"
            ? event?.value
            : noExponentsValue(Number(event?.value))}
        </p>
      </div>
      {/* <p>{e?.name}</p>
                <p>{e.type}</p>
                <p>{e.value}</p> */}
    </span>
  );
};
