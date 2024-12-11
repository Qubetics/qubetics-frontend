"use client";
import React, { useEffect, useState } from "react";
import ContractInfo from "./ContractInfo";
import { Collapse, Button, Checkbox } from "antd";
import "./ContractDtlTabs.scss";
import { LinkChain } from "../../../public/SvgIcons";
import CustomInput from "../customInput/CustomInput";
import Web3 from "web3";
import { useContractData } from "../contexts/contractContext";
import Loader from "../loader/Loader";

function WriteContent({ abiData, hash }) {
  const [writeData, setWriteData] = useState([]);
  const [inputData, setInputData] = useState({});
  const [expandedAccordion, setExpandedAccordion] = useState(null);
  const [writeResult, setWriteResult] = useState("");
  const [inputErrors, setInputErrors] = useState({});
  const [isLoading, setIsLoading] = useState("");
  const parsedAbiData = JSON.parse(abiData);
  const [writeError, setWriteError] = useState("");
  const { connectAddress } = useContractData();

  useEffect(() => {
    const getReadData = parsedAbiData?.filter((res) => {
      if (res?.stateMutability !== "view" && res?.type == "function") {
        return res;
      }
    });
    setWriteData(getReadData);
  }, []);

  const handleChange = (field, value) => {
    setWriteError("");
    setInputData((prevState) => ({
      ...prevState,
      [field]: value,
    }));

    // Clear error message when user starts typing
    setInputErrors((prevState) => ({
      ...prevState,
      [field]: "",
    }));
  };

  const handleWriteClick = async (event) => {
    setIsLoading(true);
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(parsedAbiData, hash);
        const writeValues = Object.values(inputData).map((value) => {
          try {
            return JSON.parse(value);
          } catch (error) {
            return value;
          }
        });
        await contract.methods[event](...writeValues).send({
          from: window.ethereum.selectedAddress,
        });
        setWriteError("");
        setInputData("");
        setIsLoading(false);
      } else {
        console.error("MetaMask not installed");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error transferring tokens:", error);
      setIsLoading(false);
      const errorMessage =
        error && error.message ? error.message : String(error);
      if (errorMessage) {
        setWriteError(errorMessage);
      } else {
        setWriteError("Something wrong");
      }
    }
  };
  const handleAccordionChange = (key) => {
    // Reset inputData if a new accordion is expanded
    if (expandedAccordion !== key) {
      setInputData({});
      setWriteResult("");
      setWriteError("");
      setInputErrors({});
    }
    setExpandedAccordion(key);
  };

  const validateInputs = (event) => {
    let errors = {};
    writeData?.forEach((data) => {
      data.inputs.forEach((input) => {
        if (!inputData || !inputData[input?.name]) {
          errors[input?.name] = `Please enter ${input?.name}`;
        }
      });
    });
    setInputErrors(errors);
    handleWriteClick(event);
  };

  const items = writeData?.map((data, index) => {
    const inputFields = data?.inputs?.map((input, inputIndex) => (
      <>
        <span className="AllowanceInputs" key={`${index}-input-${inputIndex}`}>
          <CustomInput
            type="text"
            label={`${input?.name} (${input.type})*`}
            placeholder={input?.type}
            name={`${input?.name}`}
            value={inputData[input.name] || ""}
            onChange={(value) => handleChange(input?.name, value)}
          />
        </span>
        {inputErrors[input.name] && (
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
          <Button
            type="primary"
            className="bluebtn"
            style={{ width: 111, marginTop: "8px" }}
            onClick={() => {
              validateInputs(data?.name);
            }}
            disabled={!connectAddress}
          >
            Write
          </Button>
          {data?.outputs[0] && (
            <p>
              <span>&rarr;</span>
              {data?.outputs[0]?.type}
            </p>
          )}
        </span>,
        <p style={{ marginTop: "10px" }}>{writeResult ? writeResult : ""}</p>,
        <p style={{ marginTop: "10px", color: "red" }}>
          {writeError ? writeError : ""}
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
      {isLoading && <Loader />}
    </div>
  );
}

export default WriteContent;
