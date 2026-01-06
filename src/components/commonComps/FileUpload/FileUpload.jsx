import React, { useState } from "react";
import "./FileUpload.scss";
import { DeleteOutlined } from "@ant-design/icons";
import { customToast } from "@/components/common/toast";

const FileUpload = ({
  label = "Upload Files",
  onChange,
  setSelectedFiles,
  selectedFiles,
}) => {
  const maxFiles = 4;
  const maxSize = 2 * 1024 * 1024;
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    let validFiles = [];

    files.forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        customToast.error(
          `${file.name} is not a valid image format (JPEG, JPG, PNG).`
        );
      } else if (file.size > maxSize) {
        customToast.error(`${file.name} exceeds the 2MB size limit.`);
      } else {
        validFiles.push(file);
      }
    });

    if (validFiles.length > maxFiles) {
      customToast.error(`You can only upload up to ${maxFiles} files.`);
      return;
    }

    const updatedFiles =
      selectedFiles.length === 0 || validFiles.length === maxFiles
        ? validFiles
        : [...selectedFiles, ...validFiles].slice(0, maxFiles);

    setSelectedFiles(updatedFiles);
    if (onChange) onChange(updatedFiles);
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
  };

  return (
    <div className="file-upload">
      <label className="upload-label">
        <input
          type="file"
          className="upload-input"
          onChange={handleFileChange}
          accept="image/jpeg, image/png, image/jpg"
          multiple
          disabled={selectedFiles.length >= maxFiles}
        />
        <span className="upload-text">
          {label} (Max: {maxFiles} files, 2MB each)
        </span>
      </label>

      {selectedFiles.length > 0 && (
        <div className="file-preview">
          <h4>Selected Files:</h4>
          <ul>
            {selectedFiles.map((file, index) => (
              <li key={index}>
                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                <button
                  className="delete-btn"
                  onClick={() => handleRemoveFile(index)}
                >
                  <DeleteOutlined />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
