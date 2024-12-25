"use client";
import { useThemeData } from "@/components/contexts/theme_context";
import { Searchicon, Searchicondark } from "../../assets/svg/SvgIcons";

const InternalSearch = ({ searchText, onChange, onKeyUp }) => {
  const { isLight } = useThemeData();

  const handleEnterClick = (e) => {
    if (e.key === "Enter" && searchValue?.length > 0) {
      handleSearch(e);
    }
  };

  return (
    <div>
      {
        <div className="searchbar container">
          <div className="searchbar_input">
            <input
              placeholder="Search for an address, block, txn hash or block hash."
              value={searchText}
              onChange={onChange}
              onKeyUp={onKeyUp}
            />
            {isLight === "lightTheme" ? <Searchicondark /> : <Searchicon />}
            {/* <button onClick={(e) => handleSearch(e)}>Search</button> */}
          </div>
        </div>

        // : (
        //   <div className="searchbar_input">
        //     <input
        //       placeholder="Search for an address, block, tx hash....."
        //       value={searchValue}
        //       onChange={(e) => handleSearchChange(e)}
        //       onKeyUp={(e) => handleEnterClick(e)}
        //       onFocus={onFocus}
        //       onBlur={onBlur}
        //     />
        //   {isLight === "lightTheme" ? <Searchicondark /> : <Searchicon />}
        //   {/* <button onClick={(e) => handleSearch(e)}>Search</button> */}
        // </div>
      }
    </div>
  );
};

export default InternalSearch;
