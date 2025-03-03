"use client";
import FilterResult from "@/components/FilterResult/FilterResult";
import TransactionsTable from "@/components/Tables/transactions";
import Heading from "@/components/heading/Heading";

import { useState } from "react";

import "../blocks/blocksummary.scss";
import { TxInfo } from "./txInfo";

const Transactionsummary = () => {

  const [txnData, setTxnData] = useState({});

 
  return (
    <div className="blocksummary">
      <div className="container">
       
        <FilterResult />
        <Heading heading="Transaction Summary" />
        <TxInfo txnData={txnData} />
        <TransactionsTable setTxnData={setTxnData} />
      </div>
    </div>
  );
};

export default Transactionsummary;
