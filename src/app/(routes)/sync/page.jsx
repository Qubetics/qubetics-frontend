"use client";

import React, { useEffect, useState } from "react";
import "./sync.scss";
import Image from "next/image";
import LogoIcon from "../../../assets/svg/NewLogo.svg";
import getSyncData from "@/services/getSyncData";

const Sync = () => {
  const [syncData, setSyncData] = useState();

  useEffect(() => {
    const response = getSyncData();
    response.then((res) => {
      setSyncData(res?.data?.result);
    });
  }, []);

  return (
    <div className="sync_header container">
      <div className="sync_header_left">
        <div className="sync_header_left_inner">
          <Image priority src={LogoIcon} alt="Logo" width={176} height={50} />
          <h2>#{syncData?.last_block_height}</h2>
        </div>
       
      </div>
      <div className="sync_state">
        <span>
          <h2>What's State Sync?</h2>
          <p>
            The Tendermint Core 0.34 release includes support for state sync,
            which allows a new node to join a network by fetching a snapshot of
            the application state at a recent height instead of fetching and
            replaying all historical blocks. This can reduce the time needed to
            sync with the network from days to minutes.{" "}
            <a
              target="_blank"
              href="https://blog.cosmos.network/cosmos-sdk-state-sync-guide-99e4cf43be2f"
            >
              Click Here
            </a>
            For more infomation.
          </p>
        </span>
      </div>
      <div className="sync_state">
        <span>
          <h2>Starting New Node From State Sync</h2>
          <p>
            <h5>
              1. Install Binary{" "}
              {`(${syncData?.data} Version: ${syncData?.version})`}
            </h5>
            We need to install the binary first and make sure that the version
            is the one currently in use on testnet.
          </p>
          <p>
            2. Enable State Sync We can configure Tendermint to use state sync
            in $DAEMON_HOME/config/config.toml.
          </p>
          <div className="sync_code">
            <pre>
              <code>
                {`> [state-sync]
> enable = true

> rpc_servers = ${syncData?.rpcServers}
> trust_height = ${syncData?.last_block_height}
> trust_hash = ${syncData?.last_block_app_hash}
                `}
                <p
                  style={{ color: "lightgreen" }}
                >{`# 2/3 of unbonding time`}</p>
                {`> trust_period = "168h"`}
              </code>
            </pre>
          </div>
          <p>
            <h5>3. Start the daemon: qubeticd start</h5> If you are resetting
            node, run qubeticd unsafe-reset-all or qubeticd tendermint
            unsafe-reset-all --home ~/.HOME before you start the daemon.
          </p>
        </span>
      </div>
      <div className="sync_state">
        <span>
          <h2>Enable Snapshot For State Sync</h2>
          <p>
            To make state sync works, we can enable snapshot in
            $DAEMON_HOME/config/app.toml
          </p>
        </span>
        <div className="sync_code">
          <pre>
            <code>
              {`> [state-sync]`}
              <p
                style={{ color: "lightgreen" }}
              >{` # snapshot-interval specifies the block interval at which local state sync snapshots are 
 #taken (0 to disable). Must be a multiple of pruning-keep-every.`}</p>
              {`> snapshot-interval = 1000`}
              <p
                style={{ color: "lightgreen" }}
              >{` # snapshot-keep-recent specifies the number of recent snapshots to keep and serve (0 to keep all). Each snapshot is about 500MiB`}</p>
              {`> snapshot-keep-recent = 2`}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};
export default Sync;
