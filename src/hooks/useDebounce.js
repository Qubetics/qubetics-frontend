import { useEffect, useState } from "react";

const useDebounce = (value, delay = 800) => {
  const [debounce, setDebounce] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounce(value), delay || 500);
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return { debounce, setDebounce };
};
export default useDebounce;
