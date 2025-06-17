"use client";
import { CheckOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { useState } from "react";
import { CopyIcons } from "../../../public/SvgIcons";

export default function CopyText({ text, hoverText }) {
  const [copied, setCopied] = useState(false);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  if (
    !text ||
    text === "" ||
    text === "undefined" ||
    text === "null" ||
    text === null
  ) {
    return null;
  }
  return (
    <>
      <Tooltip
        title={
          copied
            ? " Copied"
            : hoverText == "hash"
            ? "Copy Hash"
            : hoverText == "block"
            ? "Copy Block"
            : "Copy"
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
