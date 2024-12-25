"use client";
// import { CopyIcon, Scanner } from "../../../public/SvgIcons";
// import { CopyToClipboard } from "react-copy-to-clipboard";
// import { customToast } from "../common/toast";
import { CheckOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { useState } from "react";
import { CopyIcons } from "../../assets/svg/SvgIcons";

export default function CopyText({ text, hoverText }) {
  const [copied, setCopied] = useState(false);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    // <CopyToClipboard
    //   text={text}
    //   style={{ marginLeft: 8, cursor: "pointer", color: "#fff" }}
    //   onCopy={(e) => {
    //     customToast.success("Copied Successfully");
    //   }}
    // >
    //   {CopyIcon()}
    // </CopyToClipboard>
    <>
      <Tooltip
        title={
          copied
            ? " Copied"
            : hoverText == "hash"
            ? "Copy Hash"
            : hoverText == "block"
            ? "Copy Block"
            : "Copy Address"
        }
        onClick={handleCopyClick}
      >
        {copied ? (
          <CheckOutlined />
        ) : (
          <span>
            <CopyIcons />
          </span>
        )}
      </Tooltip>
    </>
  );
}
