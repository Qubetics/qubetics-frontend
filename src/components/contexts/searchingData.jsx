"use client";
import { useState, useContext, createContext } from "react";

export const SerachingValueContext = createContext();

export function SerachingValueProvider({ children }) {
  const [searchValue, setSearchValue] = useState("");
  const [searchData, setSearchData] = useState([]);

  return (
    <SerachingValueContext.Provider
      value={{ searchValue, setSearchValue, searchData, setSearchData }}
    >
      {children}
    </SerachingValueContext.Provider>
  );
}

export const useSearchData = () => useContext(SerachingValueContext);
