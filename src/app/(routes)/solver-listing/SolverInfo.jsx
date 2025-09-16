"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CardsOnchain from "@/components/cardOnChain/CardsOnchain";
import {
  AvgBlockTime,
  LatestBlock,
  TopValidator,
} from "../../../../public/SvgIcons";
import "./solverListing.scss";
import GetSolverSummary from "@/services/getSolverSummary";
import { calculateLiquidityUSD, noExponential } from "@/utils/commonFunctions";

export const SolverInfo = () => {
  const [totalSolver, setTotalSolver] = useState("");
  const [totalLiquidity, setTotalLiquidity] = useState("");
  const [totalTransaction, setTotalTransaction] = useState("");

  const router = useRouter();

  let currentChain =
    typeof window !== "undefined" && localStorage.getItem("chainType");

  const fetchDetails = async () => {
    if (currentChain === "") return router.replace("/");

    const result = await GetSolverSummary();
    if (!result?.data) return;

    setTotalSolver(result?.data?.total_solvers || 0);
    setTotalTransaction(result?.data?.total_transactions || 0);

    const liquidity = await calculateLiquidityUSD(
      result?.data?.total_liquidity
    );

    setTotalLiquidity(noExponential(liquidity));
  };

  const solverCards = [
    {
      id: 1,
      text: "Total Solvers",
      balance: totalSolver || 0,
      img: <LatestBlock />,
      contract: false,
      // title: "The most recently added block on the blockchain.",
    },
    {
      id: 2,
      text: "Total Liquidity",
      balance: totalLiquidity || 0,
      img: <TopValidator />,
      contract: false,
      // title:
      //   "The validator that has processed the highest number of transactions or blocks in the past 24 hours.",
    },

    {
      id: 3,
      text: "Total Transactions",
      balance: totalTransaction || 0,
      img: <AvgBlockTime />,
      contract: false,
      // title:
      //   "The average time taken to generate the last 20 blocks on the blockchain.",
    },
  ];

  useEffect(() => {
    fetchDetails();
  }, []);

  return (
    <div className="cardContract cardblocks">
      {solverCards?.map((item) => (
        <CardsOnchain
          key={item?.id}
          text={item?.text}
          balance={item?.balance}
          title={item?.title}
          img={item?.img}
          contract={item?.contract}
          countime={item?.countime}
          countTimer={item?.countTimer}
          hideTooltip={true}
        />
      ))}
    </div>
  );
};
