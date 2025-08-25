import React, { useEffect, useState } from "react";
import RecentBlock from "@/components/recentBlock/RecentBlock";
import { useLatestData } from "@/components/contexts/latest_data";
import "./style.scss";
import getBlocks from "@/services/getBlocks";
import {
  ErrorStatus,
  FetchingStatus,
  InitStatus,
  Routes,
  SuccessStatus,
  dashboardCount,
  pageNo,
} from "@/constant/constant";
import { useRouter } from "next/navigation";
import Page from "@/app/(routes)/notfound/page";
import Loader from "@/components/loader/Loader";
import { useGetNetwork } from "@/components/contexts/networkChanged";
import { trackEvent } from "@/utils/eventTrack";
import { isEvmChain } from "@/components/header/helper";

const RecentBlocks = () => {
  const [recentBlocks, setRecentBlocks] = useState([]);
  const [recentBlockStatus, setRecentBlockStatus] = useState(InitStatus);
  const webSocketData = useLatestData();
  const [currentIndex, setCurrentIndex] = useState(4);
  const maxNonStaticElements = 10;
  const router = useRouter();
  const isEvm = isEvmChain();
  const { isNetworkChanged } = useGetNetwork();

  const fetchData = async () => {
    try {
      setRecentBlockStatus(FetchingStatus);
      let res = await getBlocks(
        pageNo,
        dashboardCount,
        "newest",
        "desc",
        "/main-page/blocks"
      );
      // if (res?.error === false) {
      //   const accendingBlock = res?.data?.blocks;
      // let res = await getBlocks(pageNo, dashboardCount, "/main-page/blocks");
      if (res) {
        const accendingBlock = isEvm ? res : res?.data?.blocks;
        setRecentBlocks(accendingBlock);
        setRecentBlockStatus(SuccessStatus);
      } else {
        setRecentBlockStatus(ErrorStatus);
      }
    } catch (err) {
      setRecentBlockStatus(ErrorStatus);
      return err;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (isNetworkChanged == true) {
      fetchData();
    }
  }, [isNetworkChanged]);
  useEffect(() => {
    if (!webSocketData?.blocks) return;
    let index = recentBlocks?.findIndex(
      (item) =>
        Number(item?.block || item?.height) ===
        Number(webSocketData?.blocks?.block?.height || webSocketData?.blocks)
    );

    if (index == -1) {
      setRecentBlocks([
        webSocketData?.blocks?.block || webSocketData?.blocks,
        ...recentBlocks,
      ]);
    }
  }, [webSocketData?.blocks]);

  const handleClick = () => {
    trackEvent({
      action: "button_click",
      category: "Dashboard_Blocks",
      label: "View All_Blocks",
    });
    router.push(Routes.BLOCKS);
  };
  return recentBlockStatus === InitStatus ||
    recentBlockStatus === FetchingStatus ? (
    <Loader />
  ) : (
    <div className="commontableBG">
      <div className="commontableBG_head">
        <h2>Latest Blocks</h2>
        <div className="viewAll" onClick={handleClick}>
          <p> View all</p>
        </div>
      </div>

      {recentBlocks?.length > 0 ? (
        recentBlocks.slice(0, 4)?.map((res, index) => {
          return (
            <RecentBlock
              key={res?.blocknumber || res?.height}
              customClass="carousel-item "
              data={res}
            />
          );
        })
      ) : (
        <Page />
      )}
    </div>
  );
};

export default RecentBlocks;
