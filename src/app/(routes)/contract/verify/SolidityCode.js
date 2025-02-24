import { useContractData } from "@/components/contexts/contractContext";
import { Input } from "antd";
import "./verifyContract.scss";

const SolidityCode = () => {
  const { TextArea } = Input;
  const { solidityCode, setSolidityCode } = useContractData();

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText) {
        setSolidityCode(clipboardText); // Sync with solidityCode state
      }
    } catch (error) {
      console.error("Failed to read clipboard:", error);
    }
  };

  return (
    <div className="textarea">
      <label>Enter the Solidity Contract Code below :- </label>
      <TextArea
        value={solidityCode}
        autosize={{ minRows: 2, maxRows: 6 }}
        style={{ minHeight: "176px" }}
        onChange={(e) => {
          setSolidityCode(e.target.value);
        }}
      />
      {/* <Tooltip title="Paste">
        <span onClick={handlePaste} className="textAreaPaste">
          Paste
        </span>
      </Tooltip> */}
    </div>
  );
};

export default SolidityCode;
