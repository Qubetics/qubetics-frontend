import { useGetNetwork } from "@/components/contexts/networkChanged";
import getStatistics from "@/services/getStatistics";
import { useState, useEffect } from "react";

export const useDashStats = () => {
  const [dashStats, setDashStats] = useState();
  const {isNetworkChanged } = useGetNetwork();
  const fetchDashStats = async () => {
    try {
      let respose = await getStatistics();
      setDashStats(respose?.data);
    } catch (err) {
      return err;
    }
  };
  useEffect(() => {
    fetchDashStats();
  }, [isNetworkChanged]);
  return { dashStats };
};
