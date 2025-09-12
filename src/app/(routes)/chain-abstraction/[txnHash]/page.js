"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import GetTransactionOverview from "@/services/getTransactionOverview"; // API call
import SearchbarComponent from "@/components/search/SearchbarComponent";
import "./TransactionOverview.scss";
import { RightArrowIcon } from "../../../../../public/SvgIcons";

import {
  formatPrecision,
  isStringValue,
  Routes,
  statusClass,
} from "@/constant/constant";
import { useRouter } from "next/navigation";
import CopyText from "@/components/DoCopy/CopyText";
import { convertToDateTime } from "@/utils/renderTime";
import {
  checkStatus,
  destinationTxn,
  formatToken,
  transferType,
} from "@/utils/commonFunctions";

const TransactionOverview = () => {
  const { txnHash } = useParams();
  const [intentData, setIntentData] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const router = useRouter(); // for navigation

  useEffect(() => {
    const fetchData = async () => {
      const result = await GetTransactionOverview(txnHash);
      setIntentData(result?.data?.intentList?.[0] || {});

      setLoading(false);
    };

    fetchData();
  }, [txnHash]);

  if (loading) return <div>Loading...</div>;

  const destinationClick = (type, value) => {
    const routeTo = destinationTxn(type?.toLowerCase(), value);
    routeTo && router.push(routeTo);
  };

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
          {/* <div className="transaction_overview_head_buttons">
            <Commonbtn text="View to base Explorer" />
            <Commonbtn text="View to Arbitrum Explorer" />
          </div> */}
        </div>

        <div className="transacton_overview_card overview_listing">
          {intentData?.status || intentData?.status == 0 ? (
            <h3 className={`status_${checkStatus(intentData.status)}`}>
              {checkStatus(intentData.status)}
            </h3>
          ) : null}

          <div className="listing">
            <div className="list_item">
              <h4>Intent Transaction Hash</h4>
              <h5>
                {intentData?.intent_hash ? (
                  <>
                    {intentData?.intent_hash}
                    <div className="action_btns_copy">
                      <span>
                        <CopyText text={intentData?.intent_hash} />
                      </span>
                      {/* <span>
                    <ExternalArrowIcon />
                  </span> */}
                    </div>
                  </>
                ) : (
                  "-"
                )}
              </h5>
            </div>
            <div className="list_item">
              <h4>Token</h4>
              <h5>
                {formatToken(
                  intentData?.source_token?.toLowerCase(),
                  intentData?.source_amount
                )}{" "}
                {/* {formatPrecision(intentData?.sourceAmount)} */}
                {isStringValue(intentData?.source_token)}
              </h5>
            </div>
            <div className="list_item">
              <h4>Source Chain</h4>
              <div className="chain">
                {/* <Image src={baseImg} alt="" /> */}
                <h5>{isStringValue(intentData?.source_chain)}</h5>
              </div>
            </div>
            <div className="list_item">
              <h4>Sender Address</h4>
              <h5>
                {intentData?.sender ? (
                  <>
                    {intentData?.source_address}
                    <div className="action_btns_copy">
                      <span>
                        <CopyText text={intentData?.source_address} />
                      </span>
                    </div>
                  </>
                ) : (
                  "-"
                )}
              </h5>
            </div>
            <div className="list_item">
              <h4>Time Started</h4>
              <h5>{convertToDateTime(intentData?.created_at)}</h5>
            </div>
          </div>

          <div className="listing">
            <div className="list_item">
              <h4>Destination Tx Hash</h4>
              <h5>
                {intentData?.solver_tx_hash ? (
                  <>
                    <span
                      className="list_item_pointer"
                      onClick={() =>
                        destinationClick(
                          intentData?.target_chain,
                          intentData?.solver_tx_hash
                        )
                      }
                    >
                      {intentData?.solver_tx_hash}
                    </span>
                    <div className="action_btns_copy">
                      <span>
                        <CopyText text={intentData?.solver_tx_hash} />
                      </span>
                      {/* <span>
                      <ExternalArrowIcon />
                    </span> */}
                    </div>
                  </>
                ) : (
                  "-"
                )}
              </h5>
            </div>
            <div className="list_item">
              <h4>Token</h4>
              <h5>
                {" "}
                {formatToken(
                  intentData?.target_token?.toLowerCase(),
                  intentData?.amount
                )}{" "}
                {/* {formatPrecision(intentData?.amount)} */}
                {isStringValue(intentData?.target_token)}
              </h5>
            </div>
            <div className="list_item">
              <h4>Target Chain</h4>
              <div className="chain">
                {/* <Image src={Arbitrum} alt="" /> */}
                <h5>{isStringValue(intentData?.target_chain)}</h5>
              </div>
            </div>
            <div className="list_item">
              <h4>Recipient Address</h4>
              <h5>
                {isStringValue(intentData?.target_address)}
                <div className="action_btns_copy">
                  <span>
                    <CopyText text={intentData?.target_address} />
                  </span>
                </div>
              </h5>
            </div>
            <div className="list_item">
              <h4>Time Completed</h4>
              <h5>
                {intentData?.status !== 2
                  ? convertToDateTime(intentData?.updated_at)
                  : "-"}
              </h5>
            </div>
          </div>
        </div>

        <h2 className="sub_heading">Metadata</h2>
        <div className="transacton_overview_card">
          <div className="listing">
            <div className="list_item">
              <h4>Transfer Type</h4>
              <h5>{transferType(intentData?.transfer_type)}</h5>
            </div>
            <div className="list_item">
              <h4>Job ID</h4>
              <h5>
                {intentData?.intent_id ? `#${intentData.intent_id}` : "-"}
              </h5>
            </div>
            <div className="list_item">
              <h4>Solver</h4>
              <h5>{isStringValue(intentData?.solver_id)}</h5>
            </div>
          </div>
          <div className="listing">
            <div className="status-log">
              <h4>Status Log</h4>
              <div className="timeline ">
                <div
                  className={`timeline-item ${statusClass(intentData?.status)}`}
                >
                  <span></span>
                  <div className="list_item">
                    <h4>Submitted</h4>
                    <h5>{convertToDateTime(intentData?.created_at)}</h5>
                  </div>
                </div>
                <div
                  className={`timeline-item ${statusClass(intentData?.status)}`}
                >
                  <span></span>
                  <div className="list_item">
                    <h4>Executed</h4>
                    <h5>{convertToDateTime(intentData?.solver_tx_executed)}</h5>
                  </div>
                </div>
                <div
                  className={`timeline-item ${statusClass(intentData?.status)}`}
                >
                  <span></span>
                  <div>
                    <h4>{checkStatus(intentData?.status)}</h4>
                    <h5>
                      {intentData?.status !== 2
                        ? convertToDateTime(intentData?.updated_at)
                        : "-"}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="list_item">
              <h4>Token Contract</h4>
              <h5>
                {isStringValue(intentData.sourceToken)}
                <div className="action_btns_copy">
                  <span>
                    <CopyIcons />
                  </span>
                </div>
              </h5>
            </div> */}
          </div>
        </div>

        {/* <h2 className="sub_heading">Fee & Logs</h2> */}
        {/* <div className="transacton_overview_card">
          <div className="listing">
            <div className="list_item">
              <h4>Fees</h4>
              <h5>{isStringValue(intentData?.gas_metadata?.platform_fees)}</h5>
            </div>
            <div className="list_item">
              <h4>Gas Used</h4>
              <h5>{isStringValue(intentData?.gas_metadata?.gas_used)}</h5>
            </div>
          </div>

          <div className="status-log">
            <h4>Status Log</h4>
            <div className="timeline">
              <div className="timeline-item active">
                <span></span>
                <div className="list_item">
                  <h4>Submitted</h4>
                  <h5>{convertToDateTime(intentData?.created_at)}</h5>
                </div>
              </div>
              <div className="timeline-item">
                <span></span>
                <div className="list_item">
                  <h4>Executed</h4>
                  <h5>{convertToDateTime(intentData?.solverTxExecuted)}</h5>
                </div>
              </div>
              <div className="timeline-item active">
                <span></span>
                <div>
                  <h4>{checkStatus(intentData.status)}</h4>
                  <h5>
                    {intentData?.status !== 2
                      ? convertToDateTime(intentData?.updated_at)
                      : "-"}
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default TransactionOverview;
