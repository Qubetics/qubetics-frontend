import React from "react";
import "./header.scss";
import { Select } from "antd";
import { addQubetic } from "../AddQubeticsNetwork/addQubetics";

function HeaderRight() {
  return (
    <ul className="meta_list">
      <li>
        <div className="cmnSelct headerSelct">
          <Select
            getPopupContainer={(trigger) => trigger.parentNode}
            defaultValue={chainType}
            style={{ width: 153 }}
            onChange={handleChainChange}
            options={[
              {
                value: "EVM Chain",
                label: "EVM Chain",
              },
              {
                value: "Native Chain",
                label: "Native Chain",
              },
            ]}
          />
        </div>
      </li>
      <li>
        <button className="qubeticNetwork_btn" onClick={addQubetic}>
          <Image src="/metafox.avif" width={25} height={25} alt="metafox" />
          Add {EXPLORER_CHAIN_NAME} Network
        </button>
        {/* <button className="signInBtn">Sign In</button> */}
      </li>
    </ul>
  );
}

export default HeaderRight;
