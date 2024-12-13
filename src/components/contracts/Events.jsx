"use-client";
import Page from "@/app/(routes)/notfound/page";
import {
  ErrorStatus,
  FetchingStatus,
  InitStatus,
  SuccessStatus,
  tableLimit,
} from "@/constant/constant";
import { EventsColumn } from "@/constant/graphTableValues";
import { Table } from "antd";
import React, { useEffect, useState } from "react";
import Loader from "../loader/Loader";
import getTokenEvents from "@/services/getTokenEvents";

const Events = ({ hash }) => {
  const [events, setEvents] = useState([]);
  const [eventCount, setEventCount] = useState(0);
  const [eventStatus, setEventStatus] = useState(InitStatus);
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const fetchTransactions = async () => {
    try {
      let response = await getTokenEvents(currentPage, tableLimit, hash);
      setEvents(response?.data?.contracts);
      setEventCount(response?.data?.count);
      setEventStatus(SuccessStatus);
    } catch (err) {
      setEventStatus(ErrorStatus);
      return err;
    }
  };

  useEffect(() => {
    setEventStatus(FetchingStatus);
    fetchTransactions();
  }, [currentPage, hash]);

  return eventStatus === InitStatus || eventStatus === FetchingStatus ? (
    <Loader />
  ) : eventStatus === SuccessStatus ?
   (
    <div>
      {" "}
      <Table
        columns={EventsColumn}
        dataSource={events}
        pagination={
          eventCount > tableLimit && {
            current: currentPage,
            pageSize: tableLimit,
            total: eventCount,
            onChange: handlePageChange,
          }
        }
        className="commontable contractTable"
      />
    </div>
  ) : (
    <Page />
  );
};

export default Events;
