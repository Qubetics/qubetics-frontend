// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import CustomCheckbox from "../../../components/commonComps/CustomCheckbox/CustomCheckbox";
// import CustomControl from "../../../components/commonComps/CustomControl/CustomControl";
// import CustomDropdown from "../../../components/commonComps/CustomDropdown/CustomDropdown";
// import FileUpload from "../../../components/commonComps/FileUpload/FileUpload";
// import TextArea from "../../../components/commonComps/TextArea/TextArea";
// import "./SubmissionForm.scss";
// import CustomInput from "@/components/customInput/CustomInput";
// import { GoogleKey, validationtValue } from "@/constant/constant";
// import ReCAPTCHA from "react-google-recaptcha";

// const BugForm = () => {
//   const [fieldData, setFieldData] = useState({
//     name: "",
//     email_address: "",
//     wallet_address: "",
//     telegram_id: "",
//     description: "",
//     additional_comments: "",
//     severity: "",
//   });

//   const [selectedApplication, setSelectedApplication] = useState("");
//   const [selectedBugType, setSelectedBugType] = useState("");
//   const [captchaToken, setCaptchaToken] = useState();
//   const [isFormValid, setIsFormValid] = useState(false);
//   const [isChecked, setIsChecked] = useState(false);
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [emailError, setEmailError] = useState("");
//   const [nameError, setNameError] = useState("");
//   const [walletError, setWalletError] = useState("");

//   const recaptchaRef = useRef();

//   useEffect(() => {
//     const isValid = validateForm();

//     setIsFormValid(isValid);
//   }, [
//     fieldData,
//     selectedApplication,
//     selectedBugType,
//     isChecked,
//     selectedFiles,
//   ]);

//   const validateForm = () => {
//     return (
//       fieldData.name &&
//       fieldData.email_address.trim() &&
//       fieldData.wallet_address.trim() &&
//       selectedApplication &&
//       selectedBugType &&
//       fieldData.severity &&
//       fieldData.description &&
//       fieldData.additional_comments &&
//       selectedFiles.length > 0 &&
//       isChecked &&
//       captchaToken
//     );
//   };

//   const handleChange = (field, value) => {
//     if (field === "name") {
//       const validName = value.replace(/[^a-zA-Z]/g, "").slice(0, 20);
//       setFieldData((prev) => ({ ...prev, [field]: validName }));
//       if (validName.length <= 3) {
//         setNameError("Name must be at least 3 characters");
//       } else {
//         setNameError("");
//       }
//     } else if (field === "email_address") {
//       setFieldData((prev) => ({ ...prev, [field]: value }));

//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(value)) {
//         setEmailError("Enter Valid Email");
//       } else {
//         setEmailError("");
//       }
//     } else if (field === "wallet_address") {
//       if (
//         !value.startsWith(validationtValue.START_ADDRESS) ||
//         value.length !== 42
//       ) {
//         setWalletError("Invalid Wallet Address");
//       } else {
//         setWalletError("");
//       }

//       setFieldData((prev) => ({ ...prev, [field]: value }));
//     } else {
//       setFieldData((prev) => ({ ...prev, [field]: value }));
//     }
//   };

//   const handleSelectApplication = (option) => {
//     setSelectedApplication(option);
//   };

//   const handleSelectBugType = (option) => {
//     setSelectedBugType(option);
//   };

//   const handleCheckboxChange = () => {
//     setIsChecked((prev) => !prev);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     return;
//     const bugData = new FormData();
//     bugData.append("name", fieldData.name);
//     bugData.append("email", fieldData.email_address);
//     bugData.append("walletAddress", fieldData.wallet_address);
//     bugData.append("detailedDescription", fieldData.description);
//     bugData.append("telegramId", fieldData.telegram_id);
//     bugData.append("applicationTested", selectedApplication);
//     bugData.append("bugType", selectedBugType);
//     bugData.append("severity", fieldData.severity);
//     bugData.append("additionalComments", fieldData.additional_comments);
//     bugData.append("captchaToken", captchaToken);
//     bugData.append("attachments", selectedFiles[0]);
//   };

//   //   const handleReset = () => {
//   //     if (recaptchaRef.current) recaptchaRef.current.reset();
//   //   };

//   return (
//     <div>
//       <form className="submission_form" onSubmit={handleSubmit}>
//         <CustomInput
//           label="Name"
//           placeholder="Enter Name"
//           value={fieldData?.name || ""}
//           onChange={(value) => handleChange("name", value)}
//         />
//         {nameError && <div className="error-message">{nameError}</div>}{" "}
//         <CustomInput
//           label="Email Address*"
//           placeholder="Enter Email "
//           value={fieldData.email_address || ""}
//           onChange={(value) => handleChange("email_address", value)}
//         />
//         {emailError && <div className="error-message">{emailError}</div>}
//         <CustomInput
//           label="Wallet Address*"
//           placeholder="Enter EVM Wallet Address"
//           value={fieldData.wallet_address}
//           onChange={(value) => handleChange("wallet_address", value)}
//         />
//         {walletError && <div className="error-message">{walletError}</div>}{" "}
//         <CustomInput
//           label="Telegram ID (Optional)"
//           placeholder="Enter Telegram ID"
//           value={fieldData.telegram_id}
//           onChange={(value) => handleChange("telegram_id", value)}
//         />
//         <CustomDropdown
//           label="Application Tested*"
//           options={[
//             " TICS Scan (Blockchain Explorer)",
//             "Qubetics Delegator & Validator Interfaces",
//             "Qubetics IDE",
//             "QubeQode",
//           ]}
//           placeholder="Enter Application Name"
//           onSelect={handleSelectApplication}
//         />
//         <CustomDropdown
//           label="Bug/Feedback Type*"
//           options={[
//             "Minor Bug",
//             "Major Bug",
//             "UI/UX Improvement",
//             "Feature Suggestion          ",
//           ]}
//           placeholder="Select the category that best describes your submission"
//           onSelect={handleSelectBugType}
//         />
//         <div className="submission_severityImpact">
//           <label>Severity/Impact</label>
//           <div className="submission_severityImpact_inner">
//             {["Low", "Medium", "High"].map((severity) => (
//               <CustomControl
//                 key={severity}
//                 type="radio"
//                 id={`radio-${severity}`}
//                 name="severity"
//                 // checked={fieldData.severity === severity}
//                 onChange={(e) => handleChange("severity", e.target.value)}
//                 label={severity}
//               />
//             ))}
//           </div>
//         </div>
//         <TextArea
//           label="Detailed Description*"
//           placeholder="Write here"
//           rows={4}
//           onChange={(e) => handleChange("description", e)}
//         />
//         <FileUpload
//           setSelectedFiles={setSelectedFiles}
//           selectedFiles={selectedFiles}
//         />
//         <TextArea
//           label="Additional Comments*"
//           placeholder="Write here"
//           rows={4}
//           onChange={(e) => handleChange("additional_comments", e)}
//         />
//         {GoogleKey && (
//           <div className="captcha">
//             <ReCAPTCHA
//               ref={recaptchaRef}
//               sitekey={GoogleKey}
//               onChange={(captcha) => {
//                 if (captcha) setCaptchaToken(captcha);
//               }}
//             />
//           </div>
//         )}
//         <div>
//           <CustomCheckbox
//             label="By submitting, I agree to the rules of the Quebetics Testnet Rewards Program, including the potential public acknowledgment of my contribution."
//             checked={isChecked}
//             onChange={handleCheckboxChange}
//           />
//         </div>
//         <div className="submission_btn">
//           <button
//             type="submit"
//             className="headermetaBtn preNextbtn"
//             disabled={!isFormValid}
//           >
//             Submit
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default BugForm;

"use client";
import React, { useEffect, useRef, useState } from "react";
import CustomCheckbox from "../../../components/commonComps/CustomCheckbox/CustomCheckbox";
import CustomControl from "../../../components/commonComps/CustomControl/CustomControl";
import CustomDropdown from "../../../components/commonComps/CustomDropdown/CustomDropdown";
import FileUpload from "../../../components/commonComps/FileUpload/FileUpload";
import TextArea from "../../../components/commonComps/TextArea/TextArea";
import "./SubmissionForm.scss";
import CustomInput from "@/components/customInput/CustomInput";
import { GoogleKey, validationtValue } from "@/constant/constant";
import ReCAPTCHA from "react-google-recaptcha";
import postBugReport from "@/services/postBugReport";

const BugForm = () => {
  const [fieldData, setFieldData] = useState({
    name: "",
    email_address: "",
    wallet_address: "",
    telegram_id: "",
    description: "",
    additional_comments: "",
    severity: "",
  });

  const [selectedApplication, setSelectedApplication] = useState("");
  const [selectedBugType, setSelectedBugType] = useState("");
  const [captchaToken, setCaptchaToken] = useState();
  const [isFormValid, setIsFormValid] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    wallet: "",
  });

  const recaptchaRef = useRef();

  useEffect(() => {
    const isValid = validateForm();
    setIsFormValid(isValid);
  }, [
    fieldData,
    selectedApplication,
    selectedBugType,
    isChecked,
    selectedFiles,
    captchaToken,
  ]);

  const validateForm = () => {
    return (
      fieldData.name &&
      fieldData.email_address.trim() &&
      fieldData.wallet_address.trim() &&
      selectedApplication &&
      selectedBugType &&
      fieldData.severity &&
      fieldData.description &&
      fieldData.additional_comments &&
      selectedFiles.length > 0 &&
      isChecked &&
      captchaToken
    );
  };

  const handleInputChange = (field, value) => {
    let error = "";
    switch (field) {
      case "name":
        const validName = value.replace(/[^a-zA-Z]/g, "").slice(0, 20);
        if (validName.length <= 3) error = "Name must be at least 3 characters";
        setFieldData((prev) => ({ ...prev, [field]: validName }));
        break;
      case "email_address":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) error = "Enter Valid Email";
        setFieldData((prev) => ({ ...prev, [field]: value }));
        break;
      case "wallet_address":
        if (
          !value.startsWith(validationtValue.START_ADDRESS) ||
          value.length !== 42
        )
          error = "Invalid Wallet Address";
        setFieldData((prev) => ({ ...prev, [field]: value }));
        break;
      default:
        setFieldData((prev) => ({ ...prev, [field]: value }));
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
  };

  const handleSelectApplication = (option) => setSelectedApplication(option);
  const handleSelectBugType = (option) => setSelectedBugType(option);
  const handleCheckboxChange = () => setIsChecked((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await postBugReport(
      fieldData,
      selectedApplication,
      selectedBugType,
      captchaToken,
      selectedFiles
    ).then((res) => {
      console.log(res);
    });
  };

  console.log(errors, "errors");
  return (
    <div>
      <form className="submission_form" onSubmit={handleSubmit}>
        <CustomInput
          label="Name"
          placeholder="Enter Name"
          value={fieldData.name || ""}
          onChange={(value) => handleInputChange("name", value)}
        />
        {errors.name && <div className="error-message">{errors.name}</div>}

        <CustomInput
          label="Email Address*"
          placeholder="Enter Email"
          value={fieldData.email_address || ""}
          onChange={(value) => handleInputChange("email_address", value)}
        />
        {errors.email_address && (
          <div className="error-message">{errors.email_address}</div>
        )}

        <CustomInput
          label="Wallet Address*"
          placeholder="Enter EVM Wallet Address"
          value={fieldData.wallet_address}
          onChange={(value) => handleInputChange("wallet_address", value)}
        />
        {errors.wallet_address && (
          <div className="error-message">{errors.wallet_address}</div>
        )}

        <CustomInput
          label="Telegram ID (Optional)"
          placeholder="Enter Telegram ID"
          value={fieldData.telegram_id}
          onChange={(value) => handleInputChange("telegram_id", value)}
        />

        <CustomDropdown
          label="Application Tested*"
          options={[
            "TICS Scan (Blockchain Explorer)",
            "Qubetics Delegator & Validator Interfaces",
            "Qubetics IDE",
            "QubeQode",
          ]}
          placeholder="Enter Application Name"
          onSelect={handleSelectApplication}
        />

        <CustomDropdown
          label="Bug/Feedback Type*"
          options={[
            "Minor Bug",
            "Major Bug",
            "UI/UX Improvement",
            "Feature Suggestion",
          ]}
          placeholder="Select the category that best describes your submission"
          onSelect={handleSelectBugType}
        />

        <div className="submission_severityImpact">
          <label>Severity/Impact</label>
          <div className="submission_severityImpact_inner">
            {["Low", "Medium", "High"].map((severity) => (
              <CustomControl
                key={severity}
                type="radio"
                id={`radio-${severity}`}
                name="severity"
                onChange={(e) => handleInputChange("severity", e.target.value)}
                label={severity}
              />
            ))}
          </div>
        </div>

        <TextArea
          label="Detailed Description*"
          placeholder="Write here"
          rows={4}
          onChange={(e) => handleInputChange("description", e.target.value)}
        />

        <FileUpload
          setSelectedFiles={setSelectedFiles}
          selectedFiles={selectedFiles}
        />

        <TextArea
          label="Additional Comments*"
          placeholder="Write here"
          rows={4}
          onChange={(e) =>
            handleInputChange("additional_comments", e.target.value)
          }
        />

        {GoogleKey && (
          <div className="captcha">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={GoogleKey}
              onChange={(captcha) => {
                if (captcha) setCaptchaToken(captcha);
              }}
            />
          </div>
        )}

        <div>
          <CustomCheckbox
            label="By submitting, I agree to the rules of the Quebetics Testnet Rewards Program, including the potential public acknowledgment of my contribution."
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
        </div>

        <div className="submission_btn">
          <button
            type="submit"
            className="headermetaBtn preNextbtn"
            disabled={!isFormValid}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default BugForm;
