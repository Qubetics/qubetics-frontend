"use client";
import React from "react";
import FilterResult from "@/components/FilterResult/FilterResult";
import { Col, Row, Table } from "antd";
import CardsOnchain from "@/components/cardOnChain/CardsOnchain";
import { DailyActive } from "../../../../public/SvgIcons";
import "./Providers.scss";
import Link from "next/link";
import CopyText from "@/components/DoCopy/CopyText";
import getAddress from "@/utils/getAddress";
import { Routes } from "@/constant/constant";
function Provides() {
  const dataSource = [
    {
      key: "1",
      providerName: "Tics-thunder-archive",
      walletAddress: (
        <span className=" addressText">
          <Link href={`/`}>
            {getAddress("0x1234567890123456789012345678901234567890")}
          </Link>
          <button className="copy_btn">
            <CopyText text={"0x1234567890123456789012345678901234567890"} />
          </button>
        </span>
      ),
      nodeOperators: "10 ",
      status: <p className={`active`}>Active</p>,
      onClick: () => {
      navigate()
      },
    },
    {
      key: "2",
      providerName: " Tics-thunder-archive",
      walletAddress: (
        <span className=" addressText">
          <Link href={`/`}>
            {getAddress("0x1234567890123456789012345678901234567890")}
          </Link>
          <button className="copy_btn">
            <CopyText text={"0x1234567890123456789012345678901234567890"} />
          </button>
        </span>
      ),
      nodeOperators: "10 ",
      status: <p className={`inActive`}>Inactive</p>,
    },
  ];
  const columns = [
    {
      title: "Provider Name",
      dataIndex: "providerName",
      key: "providerName",
    },
    {
      title: "Wallet Address",
      dataIndex: "walletAddress",
      key: "walletAddress",
    },
    {
      title: "Node Operators",
      dataIndex: "nodeOperators",
      key: "nodeOperators",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
  ];
  return (
    <div className="container providersSec">
      <FilterResult />
      <h2 className="analytictext">Qubetics Service Provider</h2>
      <div className="cardSec ">
        <Row gutter={[30, 16]}>
          <Col xs={24} md={12} lg={12} xl={8} xxl={8}>
            <CardsOnchain
              text="Total Provider"
              balance={"20"}
              img={<DailyActive />}
              title="Total number of Qubetics Service Providers."
            />
          </Col>
        </Row>
      </div>
      <div className="providersTable">
        <Table
          scroll={{ x: "max-content" }}
          columns={columns}
          dataSource={dataSource}
          // loading={loading}
          pagination={false}
          className="commontable"
          onRow={() => ({
            onClick: () => {
              // Navigate to provider details page
              window.location.href = Routes.PROVIDERS_DETAIL;
            },
            style: { cursor: 'pointer' }
          })}
        />
      </div>
    </div>
  );
}

export default Provides;
