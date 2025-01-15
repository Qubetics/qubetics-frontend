import React, { Children, useState } from "react";
import Link from "next/link";
import CustomInput from "../customInput/CustomInput";
import "./VerifySmartCont.scss";
import { Collapse } from "antd";
import AccordionLibName from "../accordionLibName/AccordionLibName";
import MiscSetting from "../miscSetting/MiscSetting";
import { verifyContractConstant } from "@/constant/constant";
import { useContractData } from "../contexts/contractContext";
import ABICode from "@/app/(routes)/contract/verify/ABICode";
const { Panel } = Collapse;
function VerifySmartCont({ Children, FormButton }) {
  const { formData, contractAddress, verifyAddress } = useContractData();
  return (
    <div className="verifysmartContract">
      <div>
        <div className="getqotSection">
          <Collapse bordered={false}>
            <Panel header={<>Upload Contract Source Code</>} key="1">
              <p>
                Info: <span>{verifyContractConstant.INFO}</span>
              </p>

              <ul>
                <li>
                  <p>
                    {verifyContractConstant.COMPILE}{" "}
                    <Link href="" target="__blank">
                      REMIX
                    </Link>
                    , {verifyContractConstant.CORRECT_COMPILE}
                  </p>
                </li>
                {/*
          <li>
            {verifyContractConstant.END_POINT_LINK}{" "}
            <Link href="#">Contract API Endpoint</Link>
          </li>
          */}
              </ul>
              <p>For programatic contract verification, check out the Contract API Endpoint.</p>
              <div className="contractoptimization">
                <div className="contractoptimization_details">
                  {/* <CustomInput
                    label="Contract Address"
                    value={contractAddress || verifyAddress}
                    disabled={true}
                    style={{ color: "white" }}
                  /> */}
                  <h5>Contract Address :</h5>
                  <p>{contractAddress || verifyAddress}</p>
                </div>
                <div className="contractoptimization_details">
                  {/* <CustomInput
                    label="Compiler"
                    value={formData?.compilerType}
                    disabled={true}
                    style={{ color: "white" }}
                  /> */}
                  <h5>Compiler :</h5>
                  <p>{formData?.compilerType}</p>
                </div>
                <div className="contractoptimization_details">
                  {/* <CustomInput
                    label="Compiler Version"
                    value={formData?.compilerVersion}
                    disabled={true}
                    style={{ color: "white" }}
                  /> */}
                  <h5>Compiler Version :</h5>
                  <p>{formData?.compilerVersion}</p>
                </div>
              </div>
              <div>{Children}</div>
            </Panel>
            <Panel header={<>Enter Contract ABI (Optional)</>} key="2">
              <ABICode />
            </Panel>

            <Panel header={<>Contract Library Address (for contracts that use libraries, supports up to 10 libraries) </>} key="3">
              <AccordionLibName />
            </Panel>
            <Panel header={<>{verifyContractConstant.MISC_SETTING} </>} key="4">
              <MiscSetting />
            </Panel>
          </Collapse>
        </div>
      </div>
      <FormButton />
    </div>
  );
}

export default VerifySmartCont;
