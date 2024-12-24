"use-client";
import {
  ErrorStatus,
  FetchingStatus,
  InitStatus,
  SuccessStatus,
  tableLimit,
} from "@/constant/constant";
import { EventsColumn } from "@/constant/graphTableValues";
import getTokenEvents from "@/services/getTokenEvents";
import Image from "next/image";
import { useEffect, useState } from "react";
import notFound from "../../assets/svg/notFount.svg";
import { SkeletonTableWrapper } from "../SkeletonTableWrapper/SkeletonTableWrapper";
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

  return (
    // eventStatus === InitStatus || eventStatus === FetchingStatus ? (
    //   <Loader />
    // ) : eventStatus === SuccessStatus ? (
    <div>
      {" "}
      <SkeletonTableWrapper
        columns={EventsColumn}
        isSkeleton={
          eventStatus === InitStatus || eventStatus === FetchingStatus
        }
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
        locale={{
          emptyText: (
            <div>
              <Image src={notFound} width={150} height={90} />

              <p>No Data </p>
            </div>
          ),
        }}
      />
    </div>
    // ) : (
    //   <Page />
  );
};

export default Events;
