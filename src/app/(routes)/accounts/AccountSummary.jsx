"use client";
import CardsOnchain from "@/components/cardOnChain/CardsOnchain";
import { Col, Row } from "antd";
import "../../../app/(routes)/dashboard/dashboard.scss";
import "../../../index.scss";
import { DailyActive } from "../../../../public/SvgIcons";

const AccountSummary = () => {
  return (
    <div className="cardSec onchain_sec">
      <div className="dashcardAnimation">
        <Row gutter={[30, 16]} className="onchainrowdata">
          <Col xs={24} md={12} lg={12} xl={8} xxl={8}>
            <CardsOnchain
              text="Daily Active Account"
              balance="14,833"
              img={<DailyActive />}
              title="Number of accounts active in the last 24 hours."
            />
          </Col>
          <Col xs={24} md={12} lg={12} xl={8} xxl={8}>
            <CardsOnchain
              text="Weekly Active Account"
              balance="29,038"
              img={<DailyActive />}
              title="Number of accounts active in the last 7 days."
            />
          </Col>
          <Col xs={24} md={12} lg={12} xl={8} xxl={8}>
            <CardsOnchain
              text="Monthly Active Account"
              balance="62,558"
              img={<DailyActive />}
              title="Number of accounts active in the last 30 days."
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AccountSummary;
