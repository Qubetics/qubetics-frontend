"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import GetTransactionOverview from "@/services/getTransactionOverview"; // API call
import "./TransactionOverview.scss";
import { InfoIcon, RightArrowIcon } from "../../../../../public/SvgIcons";

import { isStringValue, Routes, statusClass } from "@/constant/constant";
import { useRouter } from "next/navigation";
import CopyText from "@/components/DoCopy/CopyText";
import { convertToDateTime } from "@/utils/renderTime";
import {
  checkStatus,
  formatToken,
  getExplorerUrl,
  getTokenIcon,
  transferType,
} from "@/utils/commonFunctions";
import { truncateWithTooltip } from "@/components/commonComps/truncateWithTooltip/truncateWithTooltip";
import { Col, Row, Tooltip } from "antd";
import FilterResult from "@/components/FilterResult/FilterResult";

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

  const handleTransactionClick = (network, transactionHash) => {
    const explorerUrl = getExplorerUrl(network, transactionHash);
    if (explorerUrl) {
      window.open(explorerUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="transaction_overview">
      <div className="searchbar container">
        <FilterResult />
      </div>

      <div className="container">
        <div className="transaction_overview_head">
          <div>
            <button
              className="back_btn"
              onClick={() => router.push(Routes.CHAIN_ABSTRACTION)}
            >
              <RightArrowIcon /> Back
            </button>
            <h2 className="sub_heading top_heading">
              Intent Details{" "}
              {intentData?.status || intentData?.status == 0 ? (
                <h3 className={`status${checkStatus(intentData.status)}`}>
                  {checkStatus(intentData.status)}
                </h3>
              ) : null}
            </h2>
          </div>
        </div>

        <div className="transacton_overview_card overview_listing">
          <Row className="w-100 margin-30">
            <Col lg={12} md={12} sm={12} xs={24}>
              <div className="listing">
                <div className="list_item">
                  <h4>Intent Transaction Hash</h4>
                  <h5>
                    {intentData?.source_tx_hash ? (
                      <>
                        {truncateWithTooltip(intentData?.source_tx_hash)}
                        <div className="action_btns_copy">
                          <span>
                            <CopyText text={intentData?.source_tx_hash} />
                          </span>
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
                    {getTokenIcon(intentData?.source_token)}{" "}
                    {formatToken(
                      intentData?.source_token?.toLowerCase(),
                      intentData?.source_amount,
                    )}{" "}
                    {intentData?.source_token?.toUpperCase() || "-"}
                  </h5>
                </div>
                <div className="list_item">
                  <h4>Source Chain</h4>
                  <div className="chain">
                    <h5>
                      {isStringValue(intentData?.source_chain?.toUpperCase())}
                    </h5>
                  </div>
                </div>
                <div className="list_item">
                  <h4>Source Address</h4>
                  <h5>
                    {intentData?.source_address ? (
                      <>
                        {truncateWithTooltip(intentData?.source_address)}
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
            </Col>
            <Col lg={12} md={12} sm={12} xs={24}>
              <div className="listing">
                <div className="list_item">
                  <h4>
                    Destination Tx Hash{" "}
                    {intentData?.target_token?.toLowerCase() === "btc" && (
                      <Tooltip title="Intent completed. Please confirm the transaction on the BTC explorer.">
                        <span className="btc-info-icon">
                          <InfoIcon />
                        </span>
                      </Tooltip>
                    )}
                  </h4>
                  <h5>
                    {intentData?.destination_tx_hash ? (
                      <>
                        <span
                          className="list_item_pointer"
                          onClick={() =>
                            handleTransactionClick(
                              intentData?.target_chain,
                              intentData?.destination_tx_hash,
                            )
                          }
                        >
                          {truncateWithTooltip(intentData?.destination_tx_hash)}
                        </span>
                        <div className="action_btns_copy">
                          <span>
                            <CopyText text={intentData?.destination_tx_hash} />
                          </span>
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
                    {getTokenIcon(intentData?.target_token)}{" "}
                    {formatToken(
                      intentData?.target_token?.toLowerCase(),
                      intentData?.target_amount,
                    )}{" "}
                    {intentData?.target_token?.toUpperCase() || "-"}
                  </h5>
                </div>
                <div className="list_item">
                  <h4>Target Chain</h4>
                  <div className="chain">
                    <h5>
                      {isStringValue(intentData?.target_chain?.toUpperCase())}
                    </h5>
                  </div>
                </div>
                <div className="list_item">
                  <h4>Recipient Address</h4>
                  <h5>
                    {truncateWithTooltip(intentData?.target_address)}
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
            </Col>
          </Row>
        </div>

        <h2 className="sub_heading">Metadata</h2>
        <div className="transacton_overview_card card-progress-status">
          <Row className="w-100 margin-30">
            <Col lg={12} md={12} sm={12} xs={24}>
              <div className="listing">
                <div className="list_item">
                  <h4>Transfer Type</h4>
                  <h5>{transferType(intentData?.transfer_type)}</h5>
                </div>
                <div className="list_item">
                  <h4>Intent ID</h4>
                  <h5>
                    {intentData?.intent_id
                      ? truncateWithTooltip(`#${intentData.intent_id}`)
                      : "-"}
                  </h5>
                </div>
                <div className="list_item">
                  <h4>Solver</h4>
                  <h5>{isStringValue(intentData?.solver_id)}</h5>
                </div>
              </div>
            </Col>
            <Col lg={12} md={12} sm={12} xs={24}>
              <div className="listing">
                <div className="status-log">
                  <h4>Status Log</h4>
                  <div className="timeline ">
                    <div
                      className={`timeline-item ${
                        ![2].includes(intentData?.status)
                          ? statusClass(intentData?.status)
                          : ""
                      }`}
                    >
                      <span className="green"></span>
                      <div className="list_item">
                        <h4>Submitted</h4>
                        <h5>{convertToDateTime(intentData?.created_at)}</h5>
                      </div>
                    </div>
                    <div
                      className={`timeline-item ${statusClass(intentData?.status)}`}
                    >
                      <span className="green"></span>
                      <div className="list_item">
                        <h4>Executed</h4>
                      </div>
                    </div>
                    <div
                      className={`timeline-item ${statusClass(intentData?.status)}`}
                    >
                      <span></span>
                      <div>
                        <h4>{checkStatus(intentData?.status)}</h4>
                        <h5>
                          {![2].includes(intentData?.status)
                            ? convertToDateTime(intentData?.updated_at)
                            : null}
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default TransactionOverview;
