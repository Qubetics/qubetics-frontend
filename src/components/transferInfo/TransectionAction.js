import { capitalizeWord } from "@/utils/commonFunctions";
import Link from "next/link";
import React from "react";

const TransactionAction = ({ data }) => {
  const isDataExits = JSON?.parse(data?.logs);
  return (
    <>
      {isDataExits && (
        <div className="Transection__Action">
          <div className="Transection__Action__details">
            <div>
              <p className="action actiondata">Transaction Action</p>

              <div>
                <p>
                  {JSON?.parse(data?.input)?.name}{" "}
                  {JSON?.parse(data?.logs)[0]?.events[2]?.value}{" "}
                  <Link
                    href={`/address/${data?.tokenInfo?.contractAddress}`}
                    className="Transaction_Action_Links"
                    title={data?.tokenInfo?.contractAddress}
                  >
                    {" "}
                    {data?.tokenInfo?.tokenSymbol}{" "}
                  </Link>{" "}
                  To {JSON?.parse(data?.logs)[0]?.events[1]?.value}
                </p>
              </div>
            </div>
          </div>
          <div
            className="Transection__Action__details"
            style={{ marginTop: "15px" }}
          >
            <div>
              <p className="action actiondata">ERC-20 Tokens Transferred</p>
              <div>
                <p>
                  From{" "}
                  <Link
                    href={`/address/${
                      JSON.parse(data?.logs)[0]?.events[0]?.value
                    }`}
                    className="Transaction_Action_Links"
                  >
                    {JSON.parse(data?.logs)[0]?.events[0]?.value}{" "}
                  </Link>{" "}
                  To {JSON.parse(data?.logs)[0]?.events[1]?.value} For{" "}
                  {JSON.parse(data?.logs)[0]?.events[2]?.value}{" "}
                  <Link
                    href={`/address/${data?.tokenInfo?.contractAddress}`}
                    className="Transaction_Action_Links"
                    title={data?.tokenInfo?.contractAddress}
                  >
                    {" "}
                    {data?.tokenInfo?.tokenName}{" "}
                  </Link>
                  ({data?.tokenInfo?.tokenSymbol})
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TransactionAction;
