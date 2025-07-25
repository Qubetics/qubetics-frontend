"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import GetTransactionOverview from "@/services/getTransactionOverview"; // API call
import SearchbarComponent from "@/components/search/SearchbarComponent";
import "./TransactionOverview.scss";
import {
  CopyIcons,
  ExternalArrowIcon,
  RightArrowIcon,
} from "../../../../../public/SvgIcons";
import baseImg from "../../../../../public/Arbitrum.svg";
import Arbitrum from "../../../../../public/Arbitrum.svg";
import Image from "next/image";
import Commonbtn from "@/components/commonbtn/CommonBluebtn";
import { Routes } from "@/constant/constant";
import { useRouter } from "next/navigation";

const TransactionOverview = () => {
  const { intentHash } = useParams();
  const [intentData, setIntentData] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const router = useRouter(); // for navigation

  useEffect(() => {
    const fetchData = async () => {
      const result = await GetTransactionOverview(intentHash);
      if (result?.data?.intentList?.length) {
        setIntentData(result.data.intentList[0]);
      }
      setLoading(false);
    };

    fetchData();
  }, [intentHash]);

  if (loading) return <div>Loading...</div>;

  if (!intentData) return <div>No Data Found</div>;

  return (
    <div className="transaction_overview">
      <div className="searchbar container">
        <SearchbarComponent />
      </div>

      <div className="container">
        <div className="transaction_overview_head">
          <div>
            <button
              className="back_btn"
              onClick={() => router.push(Routes.CHAIN_ABSTRACTION)}
            >
              <RightArrowIcon /> back
            </button>
            <h2 className="sub_heading">Transaction Overview</h2>
          </div>
          <div className="transaction_overview_head_buttons">
            <Commonbtn text="View to base Explorer" />
            <Commonbtn text="View to Arbitrum Explorer" />
          </div>
        </div>

        <div className="transacton_overview_card overview_listing">
          <h3 className="status">
            {intentData.status === 1 ? "Pending" : "Completed"}
          </h3>

          <div className="listing">
            <div className="list_item">
              <h4>Intent Transaction Hash</h4>
              <h5>
                {intentData?.intentHash}
                <div className="action_btns_copy">
                  <span>
                    <CopyIcons />
                  </span>
                  <span>
                    <ExternalArrowIcon />
                  </span>
                </div>
              </h5>
            </div>
            <div className="list_item">
              <h4>Token</h4>
              <h5>{(intentData.amount / 1e18).toFixed(4)}</h5>
            </div>
            <div className="list_item">
              <h4>Chain</h4>
              <div className="chain">
                <Image src={baseImg} alt="" />
                <h5>Base</h5>
              </div>
            </div>
            <div className="list_item">
              <h4>Sender Address</h4>
              <h5>
                {intentData.sender}
                <div className="action_btns_copy">
                  <span>
                    <CopyIcons />
                  </span>
                </div>
              </h5>
            </div>
            <div className="list_item">
              <h4>Time Started</h4>
              <h5>{new Date(intentData.created_at).toLocaleString()}</h5>
            </div>
          </div>

          <div className="listing">
            <div className="list_item">
              <h4>Destination Tx Hash</h4>
              <h5>
                {intentData.solverTxHash || "Not available"}
                <div className="action_btns_copy">
                  <span>
                    <CopyIcons />
                  </span>
                  <span>
                    <ExternalArrowIcon />
                  </span>
                </div>
              </h5>
            </div>
            <div className="list_item">
              <h4>Token</h4>
              <h5>{(intentData.amount / 1e18).toFixed(4)}</h5>
            </div>
            <div className="list_item">
              <h4>Chain</h4>
              <div className="chain">
                <Image src={Arbitrum} alt="" />
                <h5>Arbitrum</h5>
              </div>
            </div>
            <div className="list_item">
              <h4>Recipient Address</h4>
              <h5>
                {intentData.targetAddress}
                <div className="action_btns_copy">
                  <span>
                    <CopyIcons />
                  </span>
                </div>
              </h5>
            </div>
            <div className="list_item">
              <h4>Time Completed</h4>
              <h5>{new Date(intentData.updated_at).toLocaleString()}</h5>
            </div>
          </div>
        </div>

        {/* <h2 className="sub_heading">Metadata</h2>
        <div className="transacton_overview_card">
          <div className="listing">
            <div className="list_item">
              <h4>Transfer Type</h4>
              <h5>Contract</h5>
            </div>
            <div className="list_item">
              <h4>Job ID</h4>
              <h5>#{intentData.nonce}</h5>
            </div>
          </div>
          <div className="listing">
            <div className="list_item">
              <h4>Solver</h4>
              <h5>{intentData.solverId || "N/A"}</h5>
            </div>
            <div className="list_item">
              <h4>Token Contract</h4>
              <h5>
                {intentData.sourceToken || "0x..."}
                <div className="action_btns_copy">
                  <span><CopyIcons /></span>
                </div>
              </h5>
            </div>
          </div>
        </div> */}

        <h2 className="sub_heading">Fee & Logs</h2>
        <div className="transacton_overview_card">
          <div className="listing">
            <div className="list_item">
              <h4>Fees</h4>
              <h5>100 TICS</h5>
            </div>
            <div className="list_item">
              <h4>Gas Used</h4>
              <h5>23,000</h5>
            </div>
            <div className="list_item">
              <h4>Gas Price</h4>
              <h5>12 Gwei</h5>
            </div>
          </div>

          <div className="status-log">
            <h4>Status Log</h4>
            <div className="timeline">
              <div className="timeline-item active">
                <span></span>
                <div className="list_item">
                  <h4>Submitted</h4>
                  <h5>22 May 2025 16:03:01</h5>
                </div>
              </div>
              <div className="timeline-item">
                <span></span>
                <div className="list_item">
                  <h4>Executed</h4>
                  <h5>22 May 2025 16:03:01</h5>
                </div>
              </div>
              <div className="timeline-item active">
                <span></span>
                <div>
                  <h4>Confirmed</h4>
                  <h5>22 May 2025 16:03:01</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionOverview;
