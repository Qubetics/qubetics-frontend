"use client";
import Loader from "@/components/loader/Loader";
import getContractDetails from "@/services/getContractDetails";
import { Button, Input } from "antd";
import { useState } from "react";
import CustomInput from "@/components/customInput/CustomInput";
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
    await signMessage(contractAddress, url, setIsLoading, setUrl, setContractAddress);
  };
  return (
    <>
      {isLoading && <Loader />}
      <div className="tokenIcon">
        <div className="container">
          <div className="searchblocks"></div>
          <div className="tokenIcon_inner">
            <h2>Verify Ownership & Submit Token Icons</h2>
            <div className="tokenIcon_inner__top">
              <form style={{ width: "100%" }}>
                <div>
                  <CustomInput type="text" label="Enter Contract Address" placeholder="OxdAC17F958D2ee523a2206206994597C13D831 ec7" name="url" onChange={handleAddressChange} value={contractAddress} />
                </div>
                {addMsg && <p style={{ color: "red" }}>Invalid Contract Address</p>}

                <div>
                  <CustomInput type="text" label="Enter URL" placeholder="Enter URL" name="url" onChange={handleImageChange} value={url} />
                </div>
                {imgErr && <p style={{ color: "#FF4E4E", textAlign: "right" }}>Invalid image URL</p>}
                {/* <Button
                  onClick={submitUrl}
                  disabled={isDisable}
                  className="token_btn"
                  style={{
                    color: "white",
                    backgroundColor: "#0096ff",
                  }}
                >
                  Submit
                </Button> */}
                <div className="tokensubmitbtn">
                  <button onClick={submitUrl} className="headermetaBtn">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TokenIcon;
