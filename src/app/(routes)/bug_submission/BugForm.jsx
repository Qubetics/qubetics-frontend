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
import { toast } from "react-toastify";
import { LoadingOutlined } from "@ant-design/icons";

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
        const validName = value.replace(/[^a-zA-Z]/g, "").slice(0, 40);
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
      if (res?.status == "201") {
        toast.success("Bug submitted successfully.");
        setFieldData({
          name: "",
          email_address: "",
          wallet_address: "",
          telegram_id: "",
          description: "",
          additional_comments: "",
          severity: "",
        });

        setSelectedApplication("");
        setSelectedBugType("");
        setSelectedFiles([]);
        setIsChecked(false);
        setCaptchaToken("");
        setErrors({
          name: "",
          email: "",
          wallet: "",
        });

        if (recaptchaRef.current) recaptchaRef.current.reset();
        setLoading(false);
      } else {
        toast.error("Something went wrong");
        setCaptchaToken("");
        if (recaptchaRef.current) recaptchaRef.current.reset();
        setLoading(false);
      }
    });
  };

  return (
    <div>
      <form className="submission_form" onSubmit={handleSubmit}>
        <CustomInput
          label="Name*"
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
          value={selectedApplication}
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
          value={selectedBugType}
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
                value={severity}
                checked={fieldData.severity === severity}
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
          value={fieldData?.description}
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
          value={fieldData?.additional_comments}
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
            disabled={!isFormValid || loading}
          >
            {loading ? <LoadingOutlined /> : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BugForm;
