"use client";
import { createContext, useContext, useState } from "react";

export const NetworkContext = createContext();

export const NetworkProvider = ({ children }) => {
  const [isNetworkChanged, setIsNetworkChanged] = useState(false);
  const [isEvm, setIsEvm] = useState(true);

  return (
    <NetworkContext.Provider
      value={{ setIsNetworkChanged, isNetworkChanged, isEvm, setIsEvm }}
    >
      {children}
    </NetworkContext.Provider>
  );
};
export const useGetNetwork = () => useContext(NetworkContext);
