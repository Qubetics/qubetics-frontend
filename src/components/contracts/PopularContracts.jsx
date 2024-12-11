"use-client";
import Link from "next/link";
import React from "react";
import "../component.scss";
import { formatDate } from "@/utils/renderTime";
import getAddress from "@/utils/getAddress";
import { SettingBox } from "../../../public/SvgIcons";

import { FetchingStatus, InitStatus, SuccessStatus } from "@/constant/constant";
import Page from "@/app/(routes)/notfound/page";
import Loader from "../loader/Loader";

const PopularContracts = (props) => {
  const { data, status } = props;

  return status === InitStatus || status === FetchingStatus ? (
    <Loader />
  ) : status === SuccessStatus && data?.length > 0 ? (
    <div className="popular">
      {data?.map((item, index) => (
        <div className="popularContract" key={index}>
          <div className="popularContract_header">
            <SettingBox />
            <h4> {item?.contractName ? item?.contractName : "-"}</h4>
          </div>
          <Link
            className="linkdata"
            href={`/contract/${item?.address}`}
          >
            <div className="popularContract_inner">
              <ul>
                <li>
                  <span>Contract Type</span>
                  <p>{item?.contractType ? item?.contractType : "-"}</p>
                </li>
                <li>
                  <span>Deployed At</span>
                  <p> {item?.createdAt ? formatDate(item?.createdAt) : ""}</p>
                </li>
                <li>
                  <span>Contract Address</span>
                  <Link href="">
                    {item?.address
                      ? getAddress(item?.address)
                      : "-"}
                  </Link>
                </li>
                <li>
                  <span>Creator</span>
                  <Link href="">
                    {item?.creator ? getAddress(item?.creator) : "-"}
                  </Link>
                </li>
              </ul>
            </div>
          </Link>
        </div>
      ))}
    </div>
  ) : (
    <Page />
  );
};

export default PopularContracts;
