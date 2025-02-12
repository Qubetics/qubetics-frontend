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
              <p className="action actiondata"> Tokens Transferred</p>
              <div>
                <p>ERC-20</p>
              </div>
            </div>
            <div style={{ marginTop: "15px" }}>
              <p className="action actiondata">From</p>
              <div>
                <p>
                  <Link
                    href={`/address/${
                      JSON.parse(data?.logs)[0]?.events[0]?.value
                    }`}
                    className="Transaction_Action_Links"
                  >
                    {JSON.parse(data?.logs)[0]?.events[0]?.value}{" "}
                  </Link>{" "}
                </p>
              </div>
            </div>
            <div style={{ marginTop: "15px" }}>
              <p className="action actiondata">To</p>
              <div>
                <p>{JSON.parse(data?.logs)[0]?.events[1]?.value}</p>
              </div>
            </div>
            <div style={{ marginTop: "15px" }}>
              <p className="action actiondata">Value</p>
              <div>
                <p>{JSON.parse(data?.logs)[0]?.events[2]?.value} </p>
              </div>
            </div>
            <div style={{ marginTop: "15px" }}>
              <p className="action actiondata">Token Name</p>
              <div>
                <p>
                  <Link
                    href={`/address/${data?.tokenInfo?.contractAddress}`}
                    className="Transaction_Action_Links"
                    title={data?.tokenInfo?.contractAddress}
                  >
                    {" "}
                    {data?.tokenInfo?.tokenName}{" "}
                  </Link>
                </p>
              </div>
            </div>{" "}
            <div style={{ marginTop: "15px" }}>
              <p className="action actiondata">Token Symbol </p>
              <div>
                <p>({data?.tokenInfo?.tokenSymbol})</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TransactionAction;
