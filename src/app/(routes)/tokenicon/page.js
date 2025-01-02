"use client";
import Loader from "@/components/loader/Loader";
import getContractDetails from "@/services/getContractDetails";
import { Button, Input } from "antd";
import { useState } from "react";
import toast from "react-hot-toast";
import { isImageUrlValid } from "./isImageUrlValid";
import { signMessage } from "./SignMessage";
import "./token.scss";

const TokenIcon = () => {
  const [url, setUrl] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imgErr, setImgErr] = useState("");
  const [addMsg, setAddMsg] = useState("");
  const [isDisable, setIsDisable] = useState(true);

  const handleImageChange = async (e) => {
    const imgUrl = e.target.value;

    if (!imgUrl) {
      setImgErr("");
      setUrl("");
      setIsDisable(true);
      return;
    }
    const checkImg = await isImageUrlValid(imgUrl);
    if (!checkImg) {
      setImgErr("Invalid image URL");
      setIsDisable(true);
    } else {
      setImgErr("");
      setIsDisable(false);
    }

    setUrl(imgUrl);
  };

  const handleAddressChange = async (e) => {
    const add = e.target.value;
    if (!add) {
      setAddMsg("");
      setContractAddress("");
      setIsDisable(true);
      return;
    }
    const res = await getContractDetails(add);
    if (res?.error) {
      setAddMsg("Invalid Contract Address");
      setIsDisable(true);
    } else {
      setAddMsg("");
      setIsDisable(false);
    }
    setContractAddress(add);
  };

  const submitUrl = async () => {
    if (!contractAddress) {
      toast.error("Enter Contract Address");
      return;
    }
    if (!url) {
      toast.error("Enter Image Url");
      return;
    }
    await signMessage(
      contractAddress,
      url,
      setIsLoading,
      setUrl,
      setContractAddress
    );
  };
  return (
    <>
      {isLoading && <Loader />}
      <div className="tokenIcon">
        <div className="container">
          <div className="searchblocks"></div>
          <div className="tokenIcon_inner">
            <h1>Verify Ownership & Submit Token Icons</h1>
            <div className="tokenIcon_inner__top">
              <form style={{ width: "100%" }}>
                <div>
                  <label>Enter Contract Address</label>
                  <Input
                    placeholder="Enter Contract Address"
                    type="text"
                    name="url"
                    onChange={handleAddressChange}
                    value={contractAddress}
                  />
                </div>
                {addMsg && (
                  <p style={{ color: "red" }}>Invalid Contract Address</p>
                )}

                <div>
                  <label style={{ marginTop: "15px" }}>Enter URL</label>
                  <Input
                    placeholder="Enter url link of your icon"
                    type="text"
                    name="url"
                    onChange={handleImageChange}
                    value={url}
                  />
                </div>
                {imgErr && <p style={{ color: "red" }}>Invalid image URL</p>}
                <Button
                  onClick={submitUrl}
                  disabled={isDisable}
                  className="token_btn"
                  style={{
                    color: "white",
                    backgroundColor: "#0096ff",
                  }}
                >
                  Submit
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TokenIcon;
