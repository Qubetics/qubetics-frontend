"use client";
import React from "react";
import Image from "next/image";
import { Row, Col } from "antd";
import "./ChartStats.scss";
import Link from "next/link";

function ChartStatsMain() {
  return (
    <div className="container chartStatsImagesMain">
      <h2 className="headingCom">Qubetics Charts & Statistics</h2>
      <div className="chartStatsImages">
        <Row gutter={[20, 20]}>
          <Col xs={24} md={12}>
            <div className="chartStatsImages_inner">
              <Link href="/charts/daily-transactions">
                <h3>Qubetics Price Analytics</h3>
                <Image
                  src="/QubeticsPrice.png"
                  alt="Logo"
                  width={644}
                  height={126}
                />
              </Link>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="chartStatsImages_inner">
              <Link href="/charts/dailycointransactions">
                <h3>Daily Coin Transactions </h3>
                <Image
                  src="/DailyCoin.png"
                  alt="Logo"
                  width={644}
                  height={126}
                />
              </Link>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="chartStatsImages_inner">
              <Link href="">
                <h3>Accounts</h3>
                <Image src="/Account.png" alt="Logo" width={644} height={126} />
              </Link>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="chartStatsImages_inner">
              <Link href="/charts/deployed-contracts">
                <h3>Contracts</h3>
                <Image
                  src="/QubeticsPrice.png"
                  alt="Logo"
                  width={644}
                  height={126}
                />
              </Link>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default ChartStatsMain;
