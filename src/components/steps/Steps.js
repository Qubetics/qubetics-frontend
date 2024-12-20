"use client";
import React, { useState } from "react";
import VerifySecondStep from "@/app/(routes)/contract/verify/VerifySecondStep";
import { Steps, theme } from "antd";
import PublishContract from "../publishContract/PublishContract";
import { InitStatus, verifyContractConstant } from "@/constant/constant";
import SearchbarComponent from "../search/SearchbarComponent";

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

const App = () => {
  const [searchStatus, setSerachStatus] = useState(InitStatus);

  const { token } = theme.useToken();
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
      <SearchbarComponent
        searchStatus={searchStatus}
        setSerachStatus={setSerachStatus}
      />
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
