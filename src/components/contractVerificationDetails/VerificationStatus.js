import { Routes, verificationStatus } from "@/constant/constant";
import React from "react";
import { Button } from "antd";
import {
  CloseCircleFilled,
  ClockCircleFilled,
  CheckCircleFilled,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";

const VerificationStatus = ({
  contractDetailData,
  compilerMessage,
  setVerifyAddress,
  hash,
}) => {
  const router = useRouter();

  switch (contractDetailData?.verificationType) {
    case -1:
      return (
        <div className="contractSourceBtn">
          <CloseCircleFilled style={{ color: "red", fontSize: 18 }} />
          {!compilerMessage?.showError
            ? `${verificationStatus.REJECTED_VERIFICATION} (ByteCode Not Matched)`
            : verificationStatus.REJECTED_VERIFICATION}
          <button
            type="primary"
            className="bluebtn"
            style={{ height: 40, marginLeft: "20px" }}
            onClick={() => {
              router.push(Routes.CONTRACT_VERIFICATOIN);
              setVerifyAddress(hash);
            }}
          >
            Verify & Publish
          </button>
        </div>
      );
    case 0:
      return (
        <>
          <div className="verificationFill">
            <ClockCircleFilled style={{ color: "yellow", fontSize: 18 }} />
            <span> {verificationStatus.PENDING_VERIFICATION}</span>
          </div>
        </>
      );
    case 1:
      return (
        <>
          <div className="verificationFill greenFill">
            <CheckCircleFilled style={{ color: "green", fontSize: 18 }} />
            <span> {verificationStatus.PARTIAL_VERIFIED}</span>
          </div>
        </>
      );
    case 2:
      return (
        <>
          <div className="verificationFill">
            <CheckCircleFilled style={{ color: "green", fontSize: 18 }} />
            <span> {verificationStatus.FULLY_VERIFIED}</span>
          </div>
        </>
      );
    default:
      return (
        <>
          <button
            type="primary"
            className="bluebtn"
            style={{ height: 40 }}
            onClick={() => {
              router.push(Routes.CONTRACT_VERIFICATOIN);
              setVerifyAddress(hash);
            }}
          >
            Verify & Publish
          </button>
        </>
      );
  }
};

export default VerificationStatus;
