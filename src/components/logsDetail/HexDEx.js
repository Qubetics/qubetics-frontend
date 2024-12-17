import React, { useState } from "react";
import CustomSelect from "../customSelect/CustomSelect";
import { LogsOption } from "@/constant/dropDownConstant";

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
          {event?.value.includes("0x") && event.type.includes("uint")
            ? Number(event?.value)
            : event?.value}
        </p>
      </div>
      {/* <p>{e?.name}</p>
                <p>{e.type}</p>
                <p>{e.value}</p> */}
    </span>
  );
};
