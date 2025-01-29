import React, { useState } from "react";
import "./FileUpload.scss";

const FileUpload = ({
  label = "Upload Files",
  accept = "*",
  multiple = true,
  onChange,
  setSelectedFiles,
  selectedFiles,
}) => {
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
    if (onChange) onChange(files);
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

// import React, { useState } from "react";
// import "./FileUpload.scss";

// const FileUpload = ({
//   label = "Upload Files",
//   accept = "*",
//   multiple = true,
//   onChange,
//   setSelectedFiles,
//   selectedFiles,
// }) => {
//   const maxFiles = 4; // Limit to 4 files

//   const handleFileChange = (event) => {
//     const files = Array.from(event.target.files);

//     if (files.length + selectedFiles.length > maxFiles) {
//       alert(`You can upload a maximum of ${maxFiles} files.`);
//       return;
//     }

//     // Update selectedFiles with the new files
//     const updatedFiles = [...selectedFiles, ...files];
//     setSelectedFiles(updatedFiles);
//     if (onChange) onChange(updatedFiles);
//   };

//   return (
//     <div className="file-upload">
//       <label className="upload-label">
//         <input
//           type="file"
//           className="upload-input"
//           onChange={handleFileChange}
//           accept={accept}
//           multiple={multiple}
//         />
//         <span className="upload-text">{label}</span>
//       </label>
//       {selectedFiles.length > 0 && (
//         <div className="file-preview">
//           <h4>Selected File{selectedFiles.length > 1 ? "s" : ""}:</h4>
//           <ul>
//             {selectedFiles.map((file, index) => (
//               <li key={index}>{file.name}</li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FileUpload;
