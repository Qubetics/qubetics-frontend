"use client";
import { EXPLORER_META_NETWORK_CHAIN_ID } from "@/constant/constant";
import { Button, Modal } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import { addQubeticForVerifyContract } from "../AddQubeticsNetwork/addQubetics";
import { useContractData } from "../contexts/contractContext";
import CopyText from "../DoCopy/CopyText";
import "./ContractDtlTabs.scss";
import getAddress from "@/utils/getAddress";

function ContractInfo() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { connectAddress, setConnectAddress } = useContractData();
  const provider = window.ethereum;

  useEffect(() => {
    checkMetaMaskAccount();
  }, []);

  const checkMetaMaskAccount = async () => {
    const chainId = await provider?.request({ method: "eth_chainId" });
    const ChainIdQubetics = EXPLORER_META_NETWORK_CHAIN_ID;
    const accounts = await provider.request({
      method: "eth_accounts",
    });

    if (ChainIdQubetics === chainId) {
      setConnectAddress(accounts[0]);
    }
    const handleAccountsChanged = (accounts) => {
      setConnectAddress(accounts[0]);
    };
    const handleDisconnect = () => {
      setConnectAddress("");
    };
    const networkChange = (id) => {
      if (id !== ChainIdQubetics) {
        setConnectAddress("");
      }
    };
    if (provider) {
      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("disconnect", handleDisconnect);
      provider.on("chainChanged", networkChange);
    }
  };

  const connectModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const connectWithWallet = () => {
    addQubeticForVerifyContract(setConnectAddress);
  };

  useEffect(() => {
    if (connectAddress) {
      setIsModalOpen(false);
    }
  }, [connectAddress]);

  return (
    <>
      {!connectAddress ? (
        <div className="disconnect">
          <p>Disconnected </p>
          <Button
            className="commoncontactbtn"
            type="primary"
            style={{ height: 40 }}
            // className="bluebtn"
            onClick={connectModal}
          >
            Connect Wallet
          </Button>
        </div>
      ) : (
        <>
          <div className="connected">
            <p>
              Connected to : &nbsp;
              <span> {getAddress(connectAddress)}</span>&nbsp;
              <CopyText text={connectAddress} />
            </p>
            <Button onClick={() => setConnectAddress("")} className="commoncontactbtn">
              {" "}
              Disconnect
            </Button>
          </div>
        </>
      )}

      <div className="contractInfo">
        <h3>Contract Information</h3>
        {/*
        <div className="buttons">
          <Button type="primary" className="bluebtn">
            Expand All
          </Button>
          <Button type="primary" className="bluebtn">
            Reset
          </Button>
        </div>
        */}
      </div>
      <Modal className="connectModal" title="Connect your wallet" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} centered>
        <ul>
          <li onClick={connectWithWallet}>
            <Image priority src="/metafox.svg" alt="Logo" width={25} height={25} />
            MetaMask
          </li>
          {/*
          <li>
            {" "}
            <Image src="/walletAdd.svg" alt="Logo" width={38} height={38} />
            Wallet Connect
          </li>
          */}
        </ul>
        <p className="agreeWallet">By Connecting a wallet you agree to the Terms of service and Optimism Community Agreements.</p>
      </Modal>
    </>
  );
}

export default ContractInfo;
