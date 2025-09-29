"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const withChainGuard = (specificRoute) => {
  return function ChainGuard() {
    const router = useRouter();

    useEffect(() => {
      // Safely access localStorage on the client side
      const chainType = window.localStorage.getItem("chainType");

      if (chainType !== "EVM Chain") {
        // Redirect to dashboard if the condition fails
        router.replace("/dashboard");
      } else {
        // Redirect to the specific route if the condition passes
        router.replace(specificRoute);
      }
    }, [router]);

    // Return null to render nothing
    return null;
  };
};

export default withChainGuard;