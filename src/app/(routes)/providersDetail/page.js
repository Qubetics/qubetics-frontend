"use client";
import { Col, Row, Table } from "antd";
import React from "react";
import {
  HrsEarnings,
  TotalEarnings,
  TotalUsers,
} from "../../../../public/SvgIcons";
import CardsOnchain from "@/components/cardOnChain/CardsOnchain";
import FilterResult from "@/components/FilterResult/FilterResult";
import Link from "next/link";
import CopyText from "@/components/DoCopy/CopyText";
import getAddress from "@/utils/getAddress";
import Heading from "@/components/heading/Heading";
import "./ProvidersDetail.scss";
function ProvidersDetail() {
  const dataSource = [
    {
      key: "1",
      dvpnName: "Tics-thunder-archive",
      country: "USA",
      region: "California",
      status: <p className={`active`}>Active</p>,
    },
    {
      key: "2",
      dvpnName: " Tics-thunder-archive",
      country: "China",
      region: "Hong Kong",
      status: <p className={`inActive`}>Inactive</p>,
    },
  ];
  const columns = [
    {
      title: "dVPN Name",
      dataIndex: "dvpnName",
      key: "dvpnName",
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "Region",
      dataIndex: "region",
      key: "region",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
  ];
  return (
    <div className="container providersDetailSec">
      <FilterResult />
      <Heading heading="Server Provider Detail Page" addresspage={true} />
      <div className="addressDetailSec">
        <div className="detail">
          <h3>Address :</h3>
          <p>
            sent14nw7yh4ujm8hf5khrr9l8592r33zjujnkm7kaw
            <CopyText text={"sent14nw7yh4ujm8hf5khrr9l8592r33zjujnkm7kaw"} />
          </p>
        </div>
      </div>
      <div className="cardSec ">
        <Row gutter={[30, 16]}>
          <Col xs={24} md={12} lg={12} xl={8} xxl={8}>
            <CardsOnchain
              text="Total Earnings"
              balance={"20"}
              img={<TotalEarnings />}
              hideTooltip
            />
          </Col>
          <Col xs={24} md={12} lg={12} xl={8} xxl={8}>
            <CardsOnchain
              text="Total Provider"
              balance={"20"}
              img={<TotalUsers />}
              hideTooltip
            />
          </Col>
          <Col xs={24} md={12} lg={12} xl={8} xxl={8}>
            <CardsOnchain
              text="Total Provider"
              balance={"20"}
              img={<HrsEarnings />}
              hideTooltip
            />
          </Col>
        </Row>
      </div>
      <h2 className="analytictext">Node Operators</h2>
      <div className="providersDetailTable">
        <Table
          scroll={{ x: "max-content" }}
          columns={columns}
          dataSource={dataSource}
          // loading={loading}
          pagination={false}
          className="commontable"
        />
      </div>
    </div>
  );
}

export default ProvidersDetail;
