"use client";

import SearchbarComponent from "@/components/search/SearchbarComponent";
import "./TransactionOverview.scss";
import {
  CopyIcon,
  CopyIcons,
  ExternalArrowIcon,
  RightArrowIcon,
} from "../../../../public/SvgIcons";
import baseImg from "../../../../public/basesvg.svg";
import Arbitrum from "../../../../public/Arbitrum.svg";
import Image from "next/image";
import Commonbtn from "@/components/commonbtn/CommonBluebtn";

const TransactionOverview = () => {
  return (
    <div className="transaction_overview">
      <div className="searchbar container">
        <SearchbarComponent />
      </div>
      <div className="container">
        <div className="transaction_overview_head">
          <div>
            <button className="back_btn">
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
          <h3 className="status">Completed</h3>
          <div className="listing">
            <div className="list_item">
              <h4>Intent Transaction Hash</h4>
              <h5>
                ex5ea95239Af8aA2A260de92Fc45898e039øc4fda7fba7793
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
              <h5>5664.49 USDC ($5663.15)</h5>
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
                5239Af8aA2A260de92Fc45898e039øc4f
                <div className="action_btns_copy">
                  <span>
                    <CopyIcons />
                  </span>
                </div>
              </h5>
            </div>
            <div className="list_item">
              <h4>Time Started</h4>
              <h5>22 May 2025 16:03:01</h5>
            </div>
          </div>

          <div className="listing">
            <div className="list_item">
              <h4>Destination Tx Hash</h4>
              <h5>
                ex5ea9523Af8aA2A260de92Fc45898e039øc4f
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
              <h5>5664.49 USDC ($5663.15)</h5>
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
                5239Af8aA2A260de92Fc45898e039øc4f
                <div className="action_btns_copy">
                  <span>
                    <CopyIcons />
                  </span>
                </div>
              </h5>
            </div>
            <div className="list_item">
              <h4>Time Completed</h4>
              <h5>22 May 2025 16:03:01</h5>
            </div>
          </div>
        </div>

        <h2 className="sub_heading">Metadata</h2>

        <div className="transacton_overview_card">
          <div className="listing">
            <div className="list_item">
              <h4>Transfer Type</h4>
              <h5>Contract</h5>
            </div>
            <div className="list_item">
              <h4>Job ID</h4>
              <h5>#123456789</h5>
            </div>
          </div>
          <div className="listing">
            <div className="list_item">
              <h4>Solver</h4>
              <h5>RouterX</h5>
            </div>
            <div className="list_item">
              <h4>Token Contract</h4>
              <h5>
                5239Af8aA2A260de92Fc45898e039øc4f
                <div className="action_btns_copy">
                  <span>
                    <CopyIcons />
                  </span>
                </div>
              </h5>
            </div>
          </div>
        </div>

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
              <div className="timeline-item ">
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
