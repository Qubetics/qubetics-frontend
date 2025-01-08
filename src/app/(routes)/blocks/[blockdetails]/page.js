"use client";
import BlockDetailDescription from "@/components/blockDetailDescription/BlockDetaildescription";
import { useGetNetwork } from "@/components/contexts/networkChanged";
import { useSearchData } from "@/components/contexts/searchingData";
import { useThemeData } from "@/components/contexts/theme_context";
import Heading from "@/components/heading/Heading";
import SearchbarComponent from "@/components/search/SearchbarComponent";
import TransactionTable from "@/components/transactionTable/TransactionTable";
import { ErrorStatus, FetchingStatus, InitStatus, SuccessStatus } from "@/constant/constant";
import getSearchingValue from "@/services/search";
import { Tabs } from "antd";
import { useEffect, useState } from "react";
import "../../../../components/transferInfo/TransferInformation.scss";
import "../blocksummary.scss";

const BlockDetails = ({ params }) => {
  const [blockData, setBlockData] = useState({});
  const [blockDetailStatus, setBlockDetailsStatus] = useState(InitStatus); //init,fetching,success,error
  const { isLight } = useThemeData();
  const { searchData } = useSearchData();
  const { isNetworkChanged } = useGetNetwork();
  const [searchStatus, setSerachStatus] = useState(InitStatus);

  const fetchData = async () => {
    try {
      if (searchData?.length == 0 || searchData) {
        setBlockDetailsStatus(FetchingStatus);
        let response = await getSearchingValue(params?.blockdetails);
        if (response?.error == false) {
          setBlockData(response?.data ? response?.data : response?.data?.block);
          setBlockDetailsStatus(SuccessStatus);
        } else {
          setBlockDetailsStatus(ErrorStatus);
          return;
        }
      } else {
        setBlockData(searchData);
        setBlockDetailsStatus(SuccessStatus);
      }
    } catch (err) {
      setBlockDetailsStatus(ErrorStatus);
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

  const tabItems = [
    {
      label: (
        <span>
          {/* {isLight == "lightTheme" ? <BlockIcondark /> : <BlockIcon />} */}
          Overview
        </span>
      ),
      key: "0",
      children: <BlockDetailDescription blockData={blockData} status={blockDetailStatus} />,
    },
    {
      label: (
        <span>
          {/* {isLight == "lightTheme" ? <TransIcondark /> : <TransIcon />} */}
          Transaction Details
        </span>
      ),
      key: "1",
      children: <TransactionTable params={params?.blockdetails} />,
    },
  ];

  return (
    <div className="blocksummary blockdetails">
      <div className="container">
        <SearchbarComponent searchStatus={searchStatus} setSerachStatus={setSerachStatus} />
        <Heading heading="Block Details" />
        <div className="blockjson">
          <Tabs defaultActiveKey="0" className="commontabs nodetabs" items={tabItems} />
        </div>
      </div>
    </div>
  );
};

export default BlockDetails;
