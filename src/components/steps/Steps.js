"use client";
import React, { useState } from "react";
import VerifySecondStep from "@/app/(routes)/contract/verify/VerifySecondStep";
import { Steps } from "antd";
import PublishContract from "../publishContract/PublishContract";
import {  verifyContractConstant } from "@/constant/constant";
import FilterResult from "../FilterResult/FilterResult";

const steps = [
  {
    title: "Enter Contract Details",
    content: <PublishContract />,
  },
  {
    title: "Verify & Publish",
    content: <VerifySecondStep />,
  },
];

/**
 * App component that manages the state and display of a multi-step verification process.
 * It utilizes Ant Design's Steps component for navigation and dynamically renders the
 * appropriate content for each step. The component maintains the current step state and
 * provides navigation functions to proceed to the next step or return to the previous one.
 * It also conditionally renders either the PublishContract or VerifySecondStep component
 * based on the current step.
 */

const App = () => {

  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const items = steps?.map((item) => ({
    key: item.title,
    title: item.title,
  }));
  const Listing = [
    verifyContractConstant.LISTING_ONE,
    verifyContractConstant.LITING_TWO,
  ];

  return (
    <div className="verify">
      {/* <SearchbarComponent
        searchStatus={searchStatus}
        setSerachStatus={setSerachStatus}
      /> */}
      <FilterResult />
      <div className="steps">
        <Steps
          responsive={false}
          labelPlacement="vertical"
          current={current}
          items={items}
        />
      </div>
      <div className="stepsFlex">
        <div className="verifyPublish__left">
          <h3>{verifyContractConstant?.VERIFY_AND_PUBLISH_CONTRACT}</h3>

          {Listing?.map((listing, index) => (
            <p key={index}>{listing}</p>
          ))}
        </div>

        <div className="verify_btns">
          {steps && current === 1 ? (
            <VerifySecondStep
              steps={steps}
              next={next}
              prev={prev}
              current={current}
            />
          ) : (
            <PublishContract
              steps={steps}
              next={next}
              prev={prev}
              current={current}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default App;
