"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import GetTransactionOverview from "@/services/getTransactionOverview"; // API call
import SearchbarComponent from "@/components/search/SearchbarComponent";
import "./TransactionOverview.scss";
import { RightArrowIcon } from "../../../../../public/SvgIcons";

import { formatPrecision, isStringValue, Routes } from "@/constant/constant";
import { useRouter } from "next/navigation";
import CopyText from "@/components/DoCopy/CopyText";
import { convertToDateTime } from "@/utils/renderTime";
import {
  checkStatus,
  destinationTxn,
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

  if (!intentData) return <div>No Data Found</div>;

  const destinationClick = (type, value) => {
    const routeTo = destinationTxn(type?.toLowerCase(), value);
    router.push(routeTo);
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
                {intentData?.intentHash ? (
                  <>
                    {intentData.intentHash}
                    <div className="action_btns_copy">
                      <span>
                        <CopyText text={intentData.intentHash} />
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
                {formatPrecision(intentData?.sourceAmount)}{" "}
                {isStringValue(intentData?.sourceToken)}
              </h5>
            </div>
            <div className="list_item">
              <h4>Source Chain</h4>
              <div className="chain">
                {/* <Image src={baseImg} alt="" /> */}
                <h5>{isStringValue(intentData?.sourceChain)}</h5>
              </div>
            </div>
            <div className="list_item">
              <h4>Sender Address</h4>
              <h5>
                {intentData?.sender ? (
                  <>
                    {intentData?.sender}
                    <div className="action_btns_copy">
                      <span>
                        <CopyText text={intentData?.sender} />
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
                {intentData?.solverTxHash ? (
                  <>
                    <span
                      className="list_item_pointer"
                      onClick={() =>
                        destinationClick(
                          intentData?.targetChain,
                          intentData?.solverTxHash
                        )
                      }
                    >
                      {intentData?.solverTxHash}
                    </span>
                    <div className="action_btns_copy">
                      <span>
                        <CopyText text={intentData?.solverTxHash} />
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
                {formatPrecision(intentData?.amount)}{" "}
                {isStringValue(intentData?.targetToken)}
              </h5>
            </div>
            <div className="list_item">
              <h4>Target Chain</h4>
              <div className="chain">
                {/* <Image src={Arbitrum} alt="" /> */}
                <h5>{isStringValue(intentData?.targetChain)}</h5>
              </div>
            </div>
            <div className="list_item">
              <h4>Recipient Address</h4>
              <h5>
                {isStringValue(intentData?.targetAddress)}
                <div className="action_btns_copy">
                  <span>
                    <CopyText text={intentData?.targetAddress} />
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
              <h5>{transferType(intentData?.transferType)}</h5>
            </div>
            <div className="list_item">
              <h4>Job ID</h4>
              <h5>
                {intentData?.intentJobId ? `#${intentData.intentJobId}` : "-"}
              </h5>
            </div>
            <div className="list_item">
              <h4>Solver</h4>
              <h5>{isStringValue(intentData?.solverId)}</h5>
            </div>
          </div>
          <div className="listing">
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
