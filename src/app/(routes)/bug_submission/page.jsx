"use client";
import Image from "next/image";
import { useState } from "react";
import TickIcon from "../../../assets/svg/TickIcon.svg";
import "./SubmissionForm.scss";
import { KeyNotes, guidelinesData, guidelinesList } from "@/constant/constant";
import BugForm from "./BugForm";

function SubmissionForm() {
  return (
    <div className="submission">
      <h3>Bug Submission Form</h3>
      <p>
        Please fill out the following fields to report a bug or provide
        feedback. Ensure your submission adheres to the rules and guidelines
        provided below.
      </p>
      <div className="submission_inner">
        <BugForm />
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
