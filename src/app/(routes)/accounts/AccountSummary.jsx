"use client";
import CardsOnchain from "@/components/cardOnChain/CardsOnchain";
import { Col, Row } from "antd";
import "../../../app/(routes)/dashboard/dashboard.scss";
import "../../../index.scss";
import { DailyActive } from "../../../../public/SvgIcons";
import { useEffect, useState } from "react";
import getAccountSummary from "@/services/getAccountSummary";
import { ErrorStatus, FetchingStatus, InitStatus } from "@/constant/constant";

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
              text="Daily Active Accounts"
              balance={summaryData?.filteredDailyData ?? "—"}
              img={<DailyActive />}
              title="Unique accounts that engaged with dVPN in the past 24 hours."
            />
          </Col>
          <Col xs={24} md={12} lg={12} xl={8} xxl={8}>
            <CardsOnchain
              text="Weekly Active Accounts"
              balance={summaryData?.filteredWeeklyData ?? "—"}
              img={<DailyActive />}
              title="Unique accounts active in dVPN interactions during the last 7 days."
            />
          </Col>
          <Col xs={24} md={12} lg={12} xl={8} xxl={8}>
            <CardsOnchain
              text="Monthly Active Accounts"
              balance={summaryData?.filteredMonthlyData ?? "—"}
              img={<DailyActive />}
              title="Unique accounts that participated in dVPN activities over the past 30 days."
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AccountSummary;
