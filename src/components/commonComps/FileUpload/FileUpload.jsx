import React, { useState } from "react";
import "./FileUpload.scss"; // Import the SCSS file for styling

const FileUpload = ({
  label = "Upload Files", // Default label
  accept = "*",          // Accepted file types
  multiple = false,      // Whether to allow multiple files
  onChange,              // Callback for handling file input
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
    if (onChange) onChange(files); // Trigger the callback with selected files
  };

  return (
    <div className="file-upload">
      <label className="upload-label">
        <input
          type="file"
          className="upload-input"
          onChange={handleFileChange}
          accept={accept}
          multiple={multiple}
        />
        <span className="upload-text">{label}</span>
      </label>
      {selectedFiles.length > 0 && (
        <div className="file-preview">
          <h4>Selected File{multiple ? "s" : ""}:</h4>
          <ul>
            {selectedFiles.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
