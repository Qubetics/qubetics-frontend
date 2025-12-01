"use client";
import { useThemeData } from "@/components/contexts/theme_context";
import { Searchicon, Searchicondark } from "../../../public/SvgIcons";

const InternalSearch = ({ searchText, onChange, onKeyUp }) => {
  const { isLight } = useThemeData();

  // const handleEnterClick = (e) => {
  //   if (e.key === "Enter" && searchValue?.length > 0) {
  //     handleSearch(e);
  //   }
  // };

  return (
    <div className="searchbar container">
      <div className="searchbar_input">
        <input
          placeholder="Search for contract name or address"
          value={searchText}
          onChange={onChange}
          onKeyUp={onKeyUp}
        />
        {isLight === "lightTheme" ? <Searchicondark /> : <Searchicon />}
        {/* <button onClick={(e) => handleSearch(e)}>Search</button> */}
      </div>
    </div>

  
  );
};

export default InternalSearch;
