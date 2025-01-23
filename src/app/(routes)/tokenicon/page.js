"use client";
import CustomInput from "@/components/customInput/CustomInput";
import useDebounce from "@/hooks/useDebounce";
import getContractDetails from "@/services/getContractDetails";
import { useEffect, useState } from "react";
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
  const [address, setAddress] = useState("");
  const [isDisable, setIsDisable] = useState(true);
  const { debounce } = useDebounce(address, 500);
  const handleImageChange = async (e) => {
    const imgUrl = e;
    setUrl(imgUrl);
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
  const checkContractDetails = async () => {
    const res = await getContractDetails(debounce);
    if (res?.error) {
      setAddMsg("Invalid Contract Address");
      setIsDisable(true);
    } else {
      setAddMsg("");
      setIsDisable(false);
    }
    setContractAddress(debounce);
  };
  useEffect(() => {
    if (debounce.length > 1) {
      checkContractDetails();
    }
  }, [debounce]);
  return (
    <>
      {/* {isLoading && <Loader />} */}
      <div className="tokenIcon">
        <div className="container">
          <div className="searchblocks"></div>
          <div className="tokenIcon_inner">
            <h2>Verify Ownership & Submit Token Icons</h2>
            <div className="tokenIcon_inner__top">
              {/* <form style={{ width: "100%" }}> */}

              <div>
                <CustomInput
                  type="text"
                  label="Enter Contract Address"
                  placeholder="OxdAC17F958D2ee523a2206206994597C13D831ec7"
                  name="url"
                  onChange={(e) => setAddress(e)}
                  value={address}
                />
              </div>
              {addMsg && (
                <p style={{ color: "red" }}>Invalid Contract Address</p>
              )}

              <div>
                <CustomInput
                  type="text"
                  label="Enter URL"
                  placeholder="Enter URL"
                  name="url"
                  onChange={(e) => handleImageChange(e)}
                  value={url}
                />
              </div>
              {imgErr && (
                <p style={{ color: "#FF4E4E", textAlign: "right" }}>
                  Invalid image URL
                </p>
              )}
              <div className="tokensubmitbtn">
                <button onClick={submitUrl} className="headermetaBtn">
                  Submit
                </button>
              </div>
              {/* </form> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TokenIcon;
