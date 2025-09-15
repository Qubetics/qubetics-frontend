"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import CardsOnchain from "@/components/cardOnChain/CardsOnchain";
import {
  AvgBlockTime,
  LatestBlock,
  TopValidator,
} from "../../../../public/SvgIcons";
import "./solverListing.scss";
import solverAbi from "../../../utils/solverAbi.json";
import GetSolverSummary from "@/services/getSolverSummary";

export const SolverInfo = () => {
  const [totalSolver, setTotalSolver] = useState("");
  const [totalLiquidity, setTotalLiquidity] = useState("");
  const [totalTransaction, setTotalTransaction] = useState("");

  const router = useRouter();

  let currentChain =
    typeof window !== "undefined" && localStorage.getItem("chainType");

  const getTopValidatorValue = async () => {
    try {
      if (currentChain === "") return router.replace("/");
      const provider = new ethers.BrowserProvider(window.ethereum);

      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_SOLVER_ADDRESS, // contract address
        solverAbi, // ABI JSON
        provider // or signer if writing
      );
      const result = await GetSolverSummary();
      setTotalSolver(result?.data?.total_solvers);
      setTotalTransaction(result?.data?.total_transactions);
      const totalLiquidity = await contract.getAllChainLiquidities();

      setTotalLiquidity(totalLiquidity?.toString());
    } catch (err) {
      return console.error("Solver contract", err);
    }
  };

  const cards = [
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
    getTopValidatorValue();
  }, []);

  return (
    <div className="cardContract cardblocks">
      {cards?.map((item) => (
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
