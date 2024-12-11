import React from "react";
import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { solidityFile } from "@/constant/constant";
import { customToast } from "@/components/common/toast";

const UploadFile = ({ fileList, setFileList, formData }) => {
  const checkJSONInput = formData?.compilerType == solidityFile.JSON_INPUT;
  const checkSolInput = formData?.compilerType == solidityFile.MULTI_PART_FILES;

  const handleChange = ({ fileList }) => {
    for (let i of fileList) {
      let checkFile = i?.originFileObj?.name;
      checkFile = checkFile.split(".");
      let fileExtension = checkFile.at(-1).toLowerCase();
      if (
        (fileExtension !== "sol" || !checkSolInput) &&
        (!checkJSONInput || fileExtension !== "json")
      ) {
        if (fileExtension !== "sol" && checkSolInput) {
          customToast.error("Upload sol file only");
        } else if (checkJSONInput && fileExtension !== "json") {
          customToast.error("Upload json file only");
        }
        return;
      }
    }
    setFileList(fileList);
  };

  const accept =
    formData?.compilerType === solidityFile.JSON_INPUT ? ".json" : ".sol";
  return (
    <div>
      <p>
        {" "}
        {formData?.compilerType == solidityFile.JSON_INPUT
          ? "Please Select The JSON File for upload *"
          : "Please select the Solidity (*.sol) files for upload *"}
      </p>
      <div className="uploadsItems">
        <Upload
          accept={accept}
          fileList={fileList}
          onChange={handleChange}
          multiple={true}
          beforeUpload={() => false}
          listType="list"
          className="avatar-uploader"
          maxCount={formData?.compilerType == solidityFile.JSON_INPUT ? 1 : 15}
        >
          <Button
            disabled={fileList.length >= 15}
            style={fileList.length >= 15 ? { color: "white" } : null}
            icon={<UploadOutlined />}
          >
            Select Files
          </Button>{" "}
          {fileList.length == 15 && (
            <p style={{ color: "red" }}>File upload is limited upto 15</p>
          )}
        </Upload>
      </div>
    </div>
  );
};

export default UploadFile;
