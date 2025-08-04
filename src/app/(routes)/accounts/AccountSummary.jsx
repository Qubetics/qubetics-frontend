"use client";
import CardsOnchain from "@/components/cardOnChain/CardsOnchain";
import { Col, Row } from "antd";
import "../../../app/(routes)/dashboard/dashboard.scss";
import "../../../index.scss";
import { DailyActive } from "../../../../public/SvgIcons";
import { useEffect, useState } from "react";
import { ErrorStatus, FetchingStatus, InitStatus } from "@/constant/constant";
import { getAccountSummary } from "@/services/getAccountSummary";

const AccountSummary = () => {
  const [summaryData, setSummaryData] = useState(null);
  const [tokenStatus, setTokenStatus] = useState(InitStatus);

  const fetchData = async () => {
    try {
      setTokenStatus(FetchingStatus);
      const response = await getAccountSummary();
      if (response && response.data) {
        setSummaryData(response.data);
      } else {
        setSummaryData(null);
      }
    } catch (err) {
      console.error("Error fetching accounts data:", err);
      setTokenStatus(ErrorStatus);
      setSummaryData(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="cardSec onchain_sec">
      <div className="dashcardAnimation">
        <Row gutter={[30, 16]} className="onchainrowdata">
          <Col xs={24} md={12} lg={12} xl={8} xxl={8}>
            <CardsOnchain
              text="Daily Active Account"
              balance={summaryData?.filteredDailyData ?? "—"}
              img={<DailyActive />}
              title="Number of accounts active in the last 24 hours."
            />
          </Col>
          <Col xs={24} md={12} lg={12} xl={8} xxl={8}>
            <CardsOnchain
              text="Weekly Active Account"
              balance={summaryData?.filteredWeeklyData ?? "—"}
              img={<DailyActive />}
              title="Number of accounts active in the last 7 days."
            />
          </Col>
          <Col xs={24} md={12} lg={12} xl={8} xxl={8}>
            <CardsOnchain
              text="Monthly Active Account"
              balance={summaryData?.filteredMonthlyData ?? "—"}
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
