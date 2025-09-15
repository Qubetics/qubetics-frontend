"use client";

import { useEffect, useState } from "react";
import { tableLimit } from "@/constant/constant";
import FilterResult from "@/components/FilterResult/FilterResult";
import Heading from "@/components/heading/Heading";
import { SkeletonTableWrapper } from "@/components/SkeletonTableWrapper/SkeletonTableWrapper";
import Pagination from "@/components/Pagination/Pagination";
import { solverColumn } from "@/constant/graphTableValues";
import { SolverInfo } from "./SolverInfo";
import "./solverListing.scss";
import GetSolverListing from "@/services/getSolverListing";

const BlockSummary = () => {
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [solverListing, setSolverListing] = useState([]);

  const [loading, setLoading] = useState(true);

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

  const handleLast = () => {
    if (currentPage < totalPages) {
      setCurrentPage(totalPages);
    }
  };

  const handleFirst = () => {
    if (currentPage > 1) {
      setCurrentPage(1);
    }
  };

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const result = await GetSolverListing(currentPage, tableLimit);
      setLoading(false);

      if (result?.data?.solver_list?.length) {
        const count = Number(result?.data?.total || 0);
        setTotalPages(Math.ceil(count / tableLimit));

        setSolverListing(result?.data?.solver_list || []);
      }
    } catch (err) {
      console.error("Error", err);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [currentPage]);

  return (
    <div className="blocksummary">
      <div className="container">
        <FilterResult />
        <Heading heading={"Solver Summary"} />
        <SolverInfo />
        <SkeletonTableWrapper
          columns={solverColumn}
          dataSource={solverListing}
          isSkeleton={loading}
          className="commontable"
        />

        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            disablePrev={currentPage === 1}
            disableNext={currentPage === totalPages}
            handleFirst={handleFirst}
            handleLast={handleLast}
            pageSize={2}
          />
        )}
      </div>
    </div>
  );
};

export default BlockSummary;
