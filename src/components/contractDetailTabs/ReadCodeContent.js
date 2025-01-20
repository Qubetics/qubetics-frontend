"use client";
import React, { useEffect, useState } from "react";
import { Collapse, Button } from "antd";
import "./ContractDtlTabs.scss";
import { LinkChain } from "../../../public/SvgIcons";
import CustomInput from "../customInput/CustomInput";
import Web3 from "web3";
import { WEB_PROVIDER_URL } from "@/constant/constant";
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

  const handleReadClick = async (data) => {
    try {
      setIsLoading(true);
      const web3 = new Web3(new Web3.providers.HttpProvider(`${WEB_PROVIDER_URL}`));
      const contract = new web3.eth.Contract(parsedAbiData, hash);
      // const readValue = Object.values(inputData);
      const readValue = Object.values(inputData).map((value) => {
        try {
          return JSON.parse(value);
        } catch (error) {
          return value;
        }
      });
      const result = await contract.methods[data](...readValue).call();
      typeof result == "bigint" ? setReadResult(result.toString()) : setReadResult(result);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error while performing read operations:", error);
      const errorMessage = error && error.message ? error.message : String(error);
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

  const items = readData?.map((data, index) => {
    const inputFields = data?.inputs?.map((input, inputIndex) => (
      <>
        <span className="AllowanceInputs" key={`${index}-input-${inputIndex}`}>
          <CustomInput type="text" label={`${input?.name} (${input?.type})*`} placeholder={input?.type} name={`${input?.name}`} value={inputData[input?.name]} onChange={(value) => handleChange(input?.name, value)} />
        </span>
        {inputErrors[input?.name] && <p style={{ color: "red" }}>{inputErrors[input?.name]}</p>}
      </>
    ));
    return {
      key: `${index}`,
      label: [<LinkChain key={`${index}-link`} />, `${index + 1}. ${data?.name}`],
      children: [
        ...inputFields,
        <span className="buttonText" key={`${index}-button`}>
          <Button
            // className="bluebtn"
            style={{ width: 111 }}
            onClick={() => {
              validateInputs(data?.name);
            }}
            disabled={isLoading}
          >
            {isLoading ? "Loading" : "Read"}
          </Button>
          {data.outputs[0] && (
            <p>
              <span>&rarr;</span>
              {data.outputs[0]?.type}
            </p>
          )}
        </span>,
        <p style={{ marginTop: "10px" }}>{readResult ? readResult : ""}</p>,
        <p style={{ marginTop: "10px", color: "red" }}>{readError ? readError : ""}</p>,
      ],
    };
  });

  return (
    <div className="readCodeContent">
      <div className="readCodeCotent__disconnect">
        <ContractInfo />
        <Collapse accordion items={items} onChange={handleAccordionChange} activeKey={expandedAccordion} />
      </div>
    </div>
  );
}

export default ReadCodeContent;
