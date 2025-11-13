"use client";
import { Col, Row, Tooltip } from "antd";
import React, { useState, useEffect } from "react";
import { HrsEarnings, TotalEarnings, TotalUsers } from "../../../../../public/SvgIcons";
import CardsOnchain from "@/components/cardOnChain/CardsOnchain";
import FilterResult from "@/components/FilterResult/FilterResult";
import CopyText from "@/components/DoCopy/CopyText";
import Heading from "@/components/heading/Heading";
import "./ProvidersDetail.scss";
import { currencyName, tableLimit, providerDetailsColumns } from "@/constant/constant";
import getProvidersDetail from "@/services/getProvidersDetail";
import { SkeletonTableWrapper } from "@/components/SkeletonTableWrapper/SkeletonTableWrapper";
import Pagination from "@/components/Pagination/Pagination";
import { useParams, useRouter } from "next/navigation";
import getProvidersDetailSummary from "@/services/getProvidersDetailSummary";
import Loader from "@/components/loader/Loader";
import { formatToTwoDecimals } from "@/utils/commonFunctions";

function ProvidersDetail() {
  const [providersDetail, setProvidersDetail] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [providersDetailStatus, setProvidersDetailStatus] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProviders, setTotalProviders] = useState(0);

  const { address } = useParams();
  const [nodeSummaryStatus, setNodeSummaryStatus] = useState(true);
  const [nodeSummary, setNodeSummary] = useState(null);
  const router = useRouter();

  const fetchNodeSummary = async () => {
    try {
      const response = await getProvidersDetailSummary(address);
      setNodeSummary(response?.data);
      setNodeSummaryStatus(false);
    } catch (err) {
      console.error("Error fetching node summary:", err);
      setNodeSummaryStatus(false);
    }
  };

  const fetchData = async () => {
    try {
      setProvidersDetailStatus(true);
      const response = await getProvidersDetail(currentPage, tableLimit, address);

      if (response && response?.data) {
        const details = response?.data?.nodes || [];
        const totalCount = Number(response?.data?.total || 0);

        const mappedDetails = details.map((item, index) => ({
          key: index.toString(),
          dvpnName: item.nodeAddress || "-",
          country: item.location || "-",
          region: item.city || item.location || "-",
          status: (
            <p className={item.nodeStatus === "active" ? "active" : "inActive"}>
              {item.nodeStatus === "active" ? "Active" : "Inactive"}
            </p>
          ),
        }));

        setProvidersDetail(mappedDetails);
        setTotalPages(Math.ceil(totalCount / tableLimit));
        setTotalProviders(totalCount);
        setProvidersDetailStatus(false);
      } else {
        setProvidersDetailStatus(false);
        setProvidersDetail([]);
      }
    } catch (err) {
      console.error("Error fetching provider details:", err);
      setProvidersDetailStatus(false);
      setProvidersDetail([]);
    }
  };

  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePrevious = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleLast = () => currentPage < totalPages && setCurrentPage(totalPages);
  const handleFirst = () => setCurrentPage(1);

  useEffect(() => {
    if (address) {
      setNodeSummaryStatus(true);
      fetchNodeSummary();
    }
  }, [address]);

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  if (providersDetailStatus || nodeSummaryStatus) {
    return <Loader />;
  }

  return (
    <div className='container providersDetailSec'>
      <FilterResult />
      <Heading heading='Server Provider Detail Page' addresspage={true} />

      <div className='addressDetailSec'>
        <div className='detail'>
          <h3>Address :</h3>
          <p>
            {address}
            <CopyText text={address} />
          </p>
        </div>
      </div>

      <div className='cardSec'>
        <Row gutter={[30, 16]}>
          <Col xs={24} md={12} lg={12} xl={8} xxl={8}>
            <CardsOnchain
              text='Total Earnings'
              balance={
                <Tooltip title={`${nodeSummary?.totalEarning || 0} ${currencyName}`}>
                  <span>{`${formatToTwoDecimals(nodeSummary?.totalEarning || 0)} ${currencyName}`}</span>
                </Tooltip>
              }
              img={<TotalEarnings />}
              title={`The total lifetime earnings generated in ${currencyName}`}
            />
          </Col>
          <Col xs={24} md={12} lg={12} xl={8} xxl={8}>
            <CardsOnchain text='Total Node Operators' balance={totalProviders} img={<TotalUsers />} hideTooltip />
          </Col>
          <Col xs={24} md={12} lg={12} xl={8} xxl={8}>
            <CardsOnchain
              text='Hourly Earnings'
              balance={
                <Tooltip title={`${nodeSummary?.dailyEarning || 0} ${currencyName}`}>
                  <span>{`${formatToTwoDecimals(nodeSummary?.dailyEarning || 0)} ${currencyName}`}</span>
                </Tooltip>
              }
              img={<HrsEarnings />}
              title={`Total rewards earned in the last 24 hours in ${currencyName}.`}
            />
          </Col>
        </Row>
      </div>

      <h2 className='analytictext'>Node Operators</h2>

      <div className='providersDetailTable'>
        <SkeletonTableWrapper
          columns={providerDetailsColumns(router)}
          dataSource={providersDetail}
          className='commontable'
          isSkeleton={providersDetailStatus}
          pagination={false}
        />

        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            handleLast={handleLast}
            handleFirst={handleFirst}
            disablePrev={currentPage === 1}
            disableNext={currentPage === totalPages}
          />
        )}
      </div>
    </div>
  );
}

export default ProvidersDetail;
