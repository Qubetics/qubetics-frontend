"use client";
import { convertArray, createTupleObject } from "@/constant/constant";
import { Collapse } from "antd";
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { LinkChain } from "../../../public/SvgIcons";
import { useContractData } from "../contexts/contractContext";
import CustomInput from "../customInput/CustomInput";
import Loader from "../loader/Loader";
import "./ContractDtlTabs.scss";
import ContractInfo from "./ContractInfo";

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
  const [txnHash, setTxnHash] = useState("");

  useEffect(() => {
    const parsedAbiData = JSON.parse(abiData);
    const getWriteData = parsedAbiData.filter((res) => {
      return res.stateMutability !== "view" && res.type === "function";
    });
    const getWriteData2 = getWriteData.map((data) => {
      if (data?.stateMutability === "payable" && data?.type === "function") {
        return {
          ...data,
          inputs: [...data.inputs, { name: "payable", type: "uint256" }],
        };
      }
      return data;
    });

    setWriteData(getWriteData2);
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
  const sortAccordingToInputs = (inputs, writeObj) => {
    const modifiedObj = {};
    inputs.forEach((input) => {
      if (input.type === "tuple") {
        modifiedObj[input.name] = sortAccordingToInputs(
          input.components,
          writeObj[input.name]
        );
      } else {
        modifiedObj[input.name] = writeObj[input.name];
      }
    });
    return modifiedObj;
  };
  const handleWriteClick = async (event) => {
    setIsLoading(true);
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(JSON.parse(abiData), hash);

        const writeObj = createTupleObject(inputData);
        let { name, inputs } = event;

        const modifiedObj = sortAccordingToInputs(inputs, writeObj);

        const writeValues = convertArray(modifiedObj);

        const txnHash = await contract.methods[name](
          ...writeValues.map((val) => {
            try {
              return JSON.parse(val);
            } catch (err) {
              return val;
            }
          })
        ).send({
          from: window.ethereum.selectedAddress,
          value: writeObj?.payable ? writeObj?.payable : 0,
        });
        setTxnHash(txnHash?.transactionHash);
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
      setWriteError(errorMessage);
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
  const renderInputFields = (inputs, prefix) => {
    return inputs.map((input, inputIndex) => {
      const label = `${input.name} (${input.type})`;
      return (
        <React.Fragment key={`${prefix}-${inputIndex}`}>
          <span className="AllowanceInputs">
            <CustomInput
              type="text"
              label={input?.type !== "tuple" ? `${label}*` : label}
              placeholder={input.type}
              name={`${prefix}${input.name}`}
              value={inputData[`${prefix}${input.name}`] || ""}
              onChange={(value) =>
                handleChange(`${prefix}${input.name}`, value)
              }
              runsCheck={undefined}
              fieldType={input.type}
            />
          </span>
          {inputErrors[`${prefix}${input.name}`] && (
            <p style={{ color: "red" }}>
              {inputErrors[`${prefix}${input.name}`]}
            </p>
          )}
          {input.type === "tuple" &&
            input.components &&
            input.components.length > 0 && (
              <div style={{ marginLeft: "20px" }}>
                {renderInputFields(input.components, `${prefix}${input.name}.`)}
              </div>
            )}
        </React.Fragment>
      );
    });
  };

  const items = writeData.map((data, index) => {
    return {
      key: `${index}`,
      label: [
        <LinkChain key={`${index}-link`} />,
        `${index + 1}. ${data?.name}`,
      ],
      children: [
        renderInputFields(data.inputs, ""),
        <span className="buttonText" key={`${index}-button`}>
          <button
            className="headermetaBtn"
            style={{ width: 111, marginTop: "8px" }}
            onClick={() => {
              validateInputs(data);
            }}
            disabled={!connectAddress}
          >
            Write
          </button>

          {data.outputs[0] && (
            <p>
              <span>&rarr;</span>
              {data.outputs[0]?.type}
            </p>
          )}
          {/* {txnHash && (
            <Button
              type="primary"
              className="bluebtn"
              style={{ width: 111, marginTop: "8px" }}
              onClick={() => router.push(`/tx/${txnHash}`)}
              disabled={!txnHash}
            >
              View Transaction
            </Button>
          )} */}
        </span>,
        <p
          style={{ marginTop: "10px" }}
          key={`${index}-result`}
          className="readContent"
        >
          {writeResult}
        </p>,
        <p
          className="err_color"
          style={{
            marginTop: "10px",
            wordBreak: "break-all",
            overflow: "hidden",
          }}
          key={`${index}-error`}
        >
          {writeError}
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
