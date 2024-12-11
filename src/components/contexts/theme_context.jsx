"use client";
import { Routes } from "@/constant/constant";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, createContext, useContext } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [showDiv, setShowDiv] = useState(false);
  const [isLight, setIsLight] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const themes = localStorage.getItem("appTheme");
    setIsLight(themes);
  }, []);

  const toggleDiv = () => {
    if (window !== undefined) {
      setShowDiv(false);
      window.scrollTo(0, 0);
      if (pathname !== Routes.HOME) {
        router.push(Routes.HOME);
      }
    }
  };

  return (
    <ThemeContext.Provider
      value={{ showDiv, toggleDiv, setShowDiv, setIsLight, isLight }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemeData = () => useContext(ThemeContext);
