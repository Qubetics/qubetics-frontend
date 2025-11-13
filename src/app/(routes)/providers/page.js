"use client";
import React, { useEffect, useState } from "react";
import FilterResult from "@/components/FilterResult/FilterResult";
import { Col, Row, Table } from "antd";
import CardsOnchain from "@/components/cardOnChain/CardsOnchain";
import { DailyActive } from "../../../../public/SvgIcons";
import "./Providers.scss";
import CopyText from "@/components/DoCopy/CopyText";
import { Routes, tableLimit } from "@/constant/constant";
import getProviderList from "@/services/getProviderList";
import { useRouter } from "next/navigation";
import Pagination from "@/components/Pagination/Pagination";
function Provides() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const columns = [
    {
      title: "Provider Name",
      dataIndex: "providerName",
      key: "providerName",
      render: (text, record) => (
        <span className=' addressText'>
          <div onClick={() => router.push(`/providersDetail/${record?.address}`)}>{record?.name || "-"}</div>
        </span>
      ),
    },
    {
      title: "Provider Address",
      dataIndex: "providerAddress",
      key: "providerAddress",
      render: (text, record) => (
        <span className=' addressText'>
          <div onClick={() => router.push(`/providersDetail/${record?.address}`)}>{record?.address || "-"}</div>
          <button className='copy_btn' onClick={(e) => e?.stopPropagation()}>
            <CopyText text={record?.address} />
          </button>
        </span>
      ),
    },
    {
      title: "Node Operators",
      dataIndex: "nodeOperators",
      key: "nodeOperators",
      render: (val, record) => <div>{record?.nodeCount}</div>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color = status === "active" ? "green" : "red";
        const text = status === "active" ? "Active" : "Inactive";
        return <span style={{ color, fontWeight: 600 }}>{text}</span>;
      },
    },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      let response = await getProviderList(currentPage);
      setData(response);
      const count = Number(response?.total?.total ?? 0) / tableLimit;
      setTotalPages(Math.ceil(count ?? 0));
    } catch (err) {
      return err;
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFirst = () => {
    if (currentPage <= totalPages) {
      setCurrentPage(1);
    }
  };

  const handleLast = () => {
    if (currentPage < totalPages) {
      setCurrentPage(totalPages);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  return (
    <div className='container providersSec'>
      <FilterResult />
      <h2 className='analytictext'>Qubetics Service Provider</h2>
      <div className='cardSec '>
        <Row gutter={[30, 16]}>
          <Col xs={24} md={12} lg={12} xl={8} xxl={8}>
            <CardsOnchain
              text='Total Provider'
              balance={data?.total?.total}
              img={<DailyActive />}
              title='Total number of Qubetics Service Providers.'
            />
          </Col>
        </Row>
      </div>
      <div className='providersTable'>
        <Table
          scroll={{ x: "max-content" }}
          columns={columns}
          dataSource={data?.data?.providers}
          loading={loading}
          pagination={false}
          className='commontable'
          // onRow={() => ({
          //   onClick: () => {
          //     window.location.href = Routes.PROVIDERS_DETAIL;
          //   },
          //   style: { cursor: "pointer" },
          // })}
        />

        {totalPages > 1 ? (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            disablePrev={currentPage === 1}
            disableNext={currentPage === totalPages}
            handleFirst={handleFirst}
            handleLast={handleLast}
          />
        ) : null}
      </div>
    </div>
  );
}

export default Provides;
