"use client";
import { WEB_PROVIDER_URL } from "@/constant/constant";
import { Collapse } from "antd";
import { useEffect, useState } from "react";
import Web3 from "web3";
import { LinkChain } from "../../../public/SvgIcons";
import CustomInput from "../customInput/CustomInput";
import "./ContractDtlTabs.scss";
import ContractInfo from "./ContractInfo";

function ReadCodeContent({ abiData, hash }) {
  const [readData, setReadData] = useState([]);
  const [inputData, setInputData] = useState({});
  const [expandedAccordion, setExpandedAccordion] = useState(null);
  const [readResult, setReadResult] = useState("");
  const [inputErrors, setInputErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [readError, setReadError] = useState("");
  const parsedAbiData = JSON.parse(abiData);

  useEffect(() => {
    const getReadData = parsedAbiData?.filter((res) => {
      if (res?.stateMutability == "view") {
        return res;
      }
    });
    setReadData(getReadData);
  }, []);

  const handleChange = (field, value) => {
    setInputData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    setInputErrors((prevState) => ({
      ...prevState,
      [field]: "",
    }));
  };
  const getFormattedResult = (result) => {
    // If it's an array, format the array items
    if (Array.isArray(result)) {
      return result.map((item) => {
        return typeof item === "bigint" ? item.toString() : item;
      });
    }

    // If it's an object (not null), format the object keys and values
    if (typeof result === "object" && result !== null) {
      // Check if the object has array-like properties (numeric indices)
      const formattedObject = Object.entries(result).reduce(
        (acc, [key, value]) => {
          // Convert BigInt to string for each value
          acc[key] = typeof value === "bigint" ? value.toString() : value;
          return acc;
        },
        {}
      );

      // Handle the case where the object might contain both array-like and named properties
      const arrayResult = Array.from(
        { length: result.__length__ },
        (_, i) => result[i]
      );
      if (arrayResult.length > 0) {
        return arrayResult;
      }

      return formattedObject;
    } else {
      // Handle single BigInt values outside of arrays and objects
      return typeof result === "bigint" ? result.toString() : result;
    }
  };
  const handleReadClick = async (data) => {
    try {
      setIsLoading(true);
      const web3 = new Web3(new Web3.providers.HttpProvider(WEB_PROVIDER_URL));
      const parsedAbiData = JSON.parse(abiData);
      const contract = new web3.eth.Contract(parsedAbiData, hash);

      const readValue = Object.values(inputData).map((value) => {
        try {
          return JSON.parse(value);
        } catch (error) {
          return value;
        }
      });

      const result = await contract.methods[data](...readValue).call();
      const formattedData = getFormattedResult(result);

      setReadResult(formattedData);
      setIsLoading(false);
      setReadError("");
    } catch (error) {
      setIsLoading(false);
      console.error("Error while performing read operations:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setReadError(errorMessage);
    }
  };

  const handleAccordionChange = (key) => {
    // Reset inputData if a new accordion is expanded
    if (expandedAccordion !== key) {
      setInputData({});
      setReadResult("");
      setInputErrors("");
      setReadError("");
    }
    setExpandedAccordion(key);
  };

  const validateInputs = (event) => {
    let errors = {};
    readData.forEach((data) => {
      data.inputs.forEach((input) => {
        if (!inputData || !inputData[input.name]) {
          errors[input.name] = `Please enter ${input.name}`;
        }
      });
    });
    setInputErrors(errors);
    handleReadClick(event);
  };
  const displayResult = (displayingData, type) => {
    if (typeof displayingData === "boolean") {
      return (
        <ul className="!list-disc !list-inside">
          {" "}
          <li>{`${type[0]?.type || "Unknown"}: ${displayingData}`}</li>{" "}
        </ul>
      );
    }
    if (!displayingData) return null;
    if (
      displayingData === null || // Check for null
      displayingData === undefined || // Check for undefined
      (typeof displayingData === "object" &&
        Object.keys(displayingData).length === 0) || // Check for empty object
      (Array.isArray(displayingData) && displayingData.length === 0) // Check for empty array
    ) {
      return null; // Do not proceed if displayingData is invalid or empty
    }

    if (!type || type.length === 0 || !Array.isArray(type)) return null;
    // Case: Single type (array length = 1)
    if (type.length === 1) {
      if (type[0]?.type === "tuple" && Array.isArray(displayingData)) {
        return (
          <ul className=" !list-disc !list-inside">
            <li>{`${type[0]?.type}: ${displayingData.join(", ")}`}</li>
          </ul>
        );
      }
      return (
        <ul className=" !list-disc !list-inside">
          <li>{`${type[0]?.type}: ${displayingData}`}</li>
        </ul>
      );
    }
    // Case: Multiple types (array length > 1)
    if (typeof displayingData === "object" && displayingData !== null) {
      return Object.entries(displayingData).map(([key, value]) => {
        if (!type[key]?.type) return null; // Skip if type[key].type is undefined
        return (
          <ul className=" !list-disc !list-inside">
            <li key={key}>{`${type[key].type}: ${value}`}</li>
          </ul>
        );
      });
    }

    // Fallback: Render as a single item
    return (
      <ul className=" !list-disc !list-inside">
        {" "}
        <li>{`${type[0]?.type || "Unknown"}: ${displayingData}`}</li>
      </ul>
    );
  };
  const items = readData?.map((data, index) => {
    const inputFields = data?.inputs?.map((input, inputIndex) => (
      <>
        <span className="AllowanceInputs" key={`${index}-input-${inputIndex}`}>
          <CustomInput
            type="text"
            label={`${input?.name} (${input?.type})*`}
            placeholder={input?.type}
            name={`${input?.name}`}
            value={inputData[input?.name]}
            onChange={(value) => handleChange(input?.name, value)}
          />
        </span>
        {inputErrors[input?.name] && (
          <p style={{ color: "red" }}>{inputErrors[input?.name]}</p>
        )}
      </>
    ));
    return {
      key: `${index}`,
      label: [
        <LinkChain key={`${index}-link`} />,
        `${index + 1}. ${data?.name}`,
      ],
      children: [
        ...inputFields,
        <span className="buttonText" key={`${index}-button`}>
          <button
            className="headermetaBtn"
            style={{ width: 111 }}
            onClick={() => {
              validateInputs(data?.name);
            }}
            disabled={isLoading}
          >
            {isLoading ? "Loading" : "Read"}
          </button>
          {data.outputs[0] && (
            <p>
              <span>&rarr;</span>
              {data.outputs[0]?.type}
            </p>
          )}
        </span>,
        <p style={{ marginTop: "10px" }} className="readContent">
          {displayResult(readResult, data?.outputs)}
        </p>,
        <p style={{ marginTop: "10px", color: "red" }}>
          {readError ? readError : ""}
        </p>,
      ],
    };
  });

  return (
    <div className="readCodeContent">
      <div className="readCodeCotent__disconnect">
        <ContractInfo />
        <Collapse
          accordion
          items={items}
          onChange={handleAccordionChange}
          activeKey={expandedAccordion}
        />
      </div>
    </div>
  );
}

export default ReadCodeContent;
