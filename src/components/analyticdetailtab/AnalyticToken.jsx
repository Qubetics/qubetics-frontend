import getAnalyticsGraph from "@/services/getAnalyticsGraph";
import { useEffect, useState } from "react";
import AnalyticGraph from "../AnalyticGraph/AnalyticGraph";
import "./analytictab.scss";
function AnalyticToken({ address }) {
  const [graphData, setGraphData] = useState();

  const fetchData = async () => {
    try {
      let response = await getAnalyticsGraph(address);
      if (response.error) {
        generateDummyData(new Date(), 100);
      } else {
        setGraphData(response?.data?.finalData);
      }
    } catch (err) {
      return err;
    }
  };

  function generateDummyData() {
    const dummyData = [];
    const numDays = 100;

    // Get today's date at midnight UTC
    const today = new Date();
    const todayMidnightUTC =
      Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate()
      ) / 1000; // in seconds

    // Start from 99 days ago up to today (inclusive)
    for (let i = 0; i < numDays; i++) {
      // Calculate the timestamp for each day (in seconds)
      const dayTimestamp = todayMidnightUTC - (numDays - 1 - i) * 86400;
      dummyData.push({
        createdAt: dayTimestamp,
        count: {
          transferAmount: 0,
          transferCount: 0,
          uniqueSenders: 0,
          uniqueReceivers: 0,
          totalUniques: 0,
        },
      });
    }
    return setGraphData(dummyData);
  }

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="analytictoken">
      {/* <h3>Time Series: Token Contract Overview</h3> */}
      <AnalyticGraph apiData={graphData} />
      {/* <h4 style={{ color: "white", textAlign: "center", fontSize: "24px", padding: "30px" }}>To Be Launched</h4> */}
    </div>
  );
}

export default AnalyticToken;
