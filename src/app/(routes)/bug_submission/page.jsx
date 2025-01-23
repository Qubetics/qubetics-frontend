"use client";
import React, { useState } from "react";
import "./SubmissionForm.scss";
import TextField from "../../../components/commonComps/TextField/";
import CustomDropdown from "../../../components/commonComps/CustomDropdown/CustomDropdown";
import TextArea from "../../../components/commonComps/TextArea/TextArea";
import FileUpload from "../../../components/commonComps/FileUpload/FileUpload";
import CommonBtn from "../../../components/commonComps/Commonbtn/Commonbtn";
import CustomCheckbox from "../../../components/commonComps/CustomCheckbox/CustomCheckbox";
import CustomControl from "../../../components/commonComps/CustomControl/CustomControl";
import Image from "next/image";
import TickIcon from "../../../assets/svg/TickIcon.svg"

function SubmissionForm() {
  const handleSelect = (option) => {
    console.log("Selected:", option);
  };
  const [selectedRadio, setSelectedRadio] = useState("option1");
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  const bugs = [
    { id: 1, type: "Minor Bug" },
    { id: 2, type: "Major Bug" },
    { id: 3, type: "UI/UX Improvement" },
    { id: 4, type: "Feature Suggestion" },
  ];
  const guidelinesData = [
    {
      id: 1,
      title: "Complete All Mandatory Fields",
      description:
        "All required fields in the form must be completed accurately, including Name, Email, and Application Tested.",
    },
    {
      id: 2,
      title: "Provide a Clear Bug Description",
      description:
        "Clearly describe the bug or feedback. Include details such as steps to reproduce the bug, expected behavior, and actual behavior. Avoid vague or incomplete descriptions.",
    },
    {
      id: 3,
      title: "Mandatory Attachments",
      description: (
        <p>
          Every bug submission must include at least one supporting file
          (screenshot or screen-recorded video) as evidence of the reported
          issue. <br /> <br />
          Ensure the uploaded file is clear, relevant, and demonstrates the bug.
        </p>
      ),
    },
    {
      id: 4,
      title: "Categorize the Bug Properly",
      description: (
        <div className="bugCategorize">
          <p>Select the appropriate category for your submission</p>
          <div className="bugCategorize_top">
            {bugs.map((bug) => (
              <div key={bug.id} className="bugCategorize_inner">
                <div></div>
                <h6>{bug.type}</h6>
              </div>
            ))}
          </div>
          <p>Incorrect categorization may delay the review process or affect reward eligibility.</p>
        </div>
      ),
    },
    {
      id: 5,
      title: "Detail the Application Tested",
      description:
        "Specify the application where the bug or issue was encountered (e.g., TICSScan, Qubetics Delegator & Validator Interfaces, Qubetics IDE, or QubeQode).",
    },
    {
      id: 6,
      title: "Severity Rating",
      description:
        "Indicate the severity level (Low, Medium, or High) based on the impact of the bug on the application’s functionality.",
    },
    {
      id: 7,
      title: "Respect Submission Deadlines",
      description:
        "Submissions must be made within the timelines outlined in the Testnet Rewards Program. Late entries will not be accepted.",
    },
    {
      id: 8,
      title: "Avoid Duplicate Submissions",
      description:
        "Check the known issues list before submitting to avoid reporting already documented bugs. Duplicate submissions will not be rewarded.",
    },
    {
      id: 8,
      title: "No Plagiarized or False Submissions",
      description:
        "Ensure the bug is original and verified. Submissions found to be false or copied from others will be disqualified.",
    },
    {
      id: 8,
      title: "Maintain Professionalism",
      description:
        "Feedback and suggestions should be constructive, actionable, and respectful.",
    },
  ];

  const guidelinesList = [
    {
      id: 1,
      title: "Validation",
      description:
        "Submissions will be reviewed for completeness, accuracy, and adherence to guidelines.",
    },
    {
      id: 2,
      title: "Testing",
      description:
        "The reported bug will be tested and verified by the development team.",
    },
    {
      id: 3,
      title: "Reward Allocation",
      description:
        "Eligible contributions will be categorized and rewarded based on complexity and impact as per the Testnet Rewards Program.",
    },
  ];
  const KeyNotes = [
    {
      id: 1,
      title:
        "Participants must agree to the terms and conditions of the Testnet Rewards Program when submitting.",
    },
    {
      id: 2,
      title:
        "Submissions that do not follow the guidelines will be marked as invalid and will not qualify for rewards.",
    },
    {
      id: 3,
      title: "A confirmation email will be sent upon successful submission.",
    },
  ];
  return (
    <div className="submission">
      <h3>Bug Submission Form</h3>
      <p>
        Please fill out the following fields to report a bug or provide
        feedback. Ensure your submission adheres to the rules and guidelines
        provided below.
      </p>
      <div className="submission_inner">
        <form className="submission_form">
          <TextField label="Name" placeholder="Enter Name" type="text" />
          <TextField label="Email Address*" placeholder="Enter Address" type="text" />
          <TextField
            label="Telegram ID (Optional)"
            placeholder="Enter Telegram ID"
            type="text"
          />
          <TextField
            label="Application Tested*"
            placeholder="Enter Application Name"
            type="text"
          />
          <CustomDropdown
            label="Choose an item"
            options={["Option 1", "Option 2", "Option 3"]}
            placeholder="Choose an item"
            onSelect={handleSelect}
          />
          <div className="submission_severityImpact">
            <label>severity/Impact</label>
            <div className="submission_severityImpact_inner">
              <CustomControl
                type="radio"
                id="radio1"
                name="customRadio"
                value="Low"
                checked={selectedRadio === "Low"}
                onChange={(e) => setSelectedRadio(e.target.value)}
                label="Low"
              />
              <CustomControl
                type="radio"
                id="radio2"
                name="customRadio"
                value="Medium"
                checked={selectedRadio === "Medium"}
                onChange={(e) => setSelectedRadio(e.target.value)}
                label="Medium"
              />
              <CustomControl
                type="radio"
                id="radio3"
                name="customRadio"
                value="High"
                checked={selectedRadio === "High"}
                onChange={(e) => setSelectedRadio(e.target.value)}
                label="High"
              />
            </div>
          </div>
          <TextArea
            label="Detailed Description*"
            placeholder="Write here"
            type="text"
            rows={4}
          />
          <FileUpload />
          <TextArea
            label="Additional Comments*"
            placeholder="Write here"
            type="text"
            rows={4}
          />
          <div>
            <CustomCheckbox
              label="By submitting, I agree to the rules of the Quebetics Testnet Rewards Program, including the potential public acknowledgment of my contribution."
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
          </div>
          <div className="submission_btn">
            <button
              className="headermetaBtn preNextbtn"
            >
              Submit
            </button>
          </div>
        </form>
        <div>
          <h4>Submission Guidelines</h4>
          <p>
            To ensure a smooth and effective process for submitting bugs and
            feedback, participants must adhere to the following rules.
            Non-compliance may result in disqualification.
          </p>
          <div>
            <h2>General Guidelines</h2>
          </div>

          {guidelinesData.map((guideline) => (
            <div className="guidelines" key={guideline.id}>
              <Image src={TickIcon} alt="" />
              <div>
                <h5>{guideline.title}</h5>
                <p>{guideline.description}</p>
              </div>
            </div>
          ))}

          <div className="reviewCommon">
            <h4>Review Process</h4>
            {guidelinesList.map((guideline) => (
              <div className="guidelines" key={guideline.id}>
                <Image src={TickIcon} alt="" />
                <div>
                  <h5>{guideline.title}</h5>
                  <p>{guideline.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="reviewCommon">
            <h4>Key Notes</h4>
            {KeyNotes.map((guideline) => (
              <div className="guidelines" key={guideline.id}>
                <Image src={TickIcon} alt="" />
                <div>
                  <h5>{guideline.title}</h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="submission_bottom">
        <p>
          For any questions or assistance, please contact the Quebetics team
          through our official channels
        </p>
        <h2>
          Thank you for contributing to the success of the Quebetics ecosystem!
        </h2>
      </div>
    </div>
  );
}

export default SubmissionForm;
