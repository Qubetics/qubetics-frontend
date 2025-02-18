"use client";
import SearchbarComponent from "@/components/search/SearchbarComponent";
import {
  ErrorStatus,
  FAUCET_AMOUNT,
  FetchingStatus,
  GoogleKey,
  InitStatus,
  Messages,
  SuccessStatus,
  validationtValue,
} from "@/constant/constant";
import postFaucet from "@/services/postFaucet";
import { LoadingOutlined } from "@ant-design/icons";
import { Input, Spin } from "antd";
import { useRef, useState,useEffect} from "react";
import ReCAPTCHA from "react-google-recaptcha";
import toast from "react-hot-toast";
import "../faucet/faucet.scss";
import { handleValidation } from "./handleValidation";
import FilterResult from "@/components/FilterResult/FilterResult";
function Page() {
  const [searchStatus, setSerachStatus] = useState(InitStatus);
  const [faucetField, setFaucetField] = useState({
    address: "",
    amount: FAUCET_AMOUNT,
  });
  const [error, setError] = useState({
    address: "",
  });
  const recaptchaRef = useRef();
  const [txHash, setTxHash] = useState();
  const [captchaToken, setCaptchaToken] = useState();
  const [transferStatus, setTransferStatus] = useState(InitStatus);
  let addressRegex = /^[a-zA-Z0-9]*$/;
  useEffect(() => {
    document.body.classList.add("faucetCustom");
    return () => {
      document.body.classList.remove("faucetCustom");
    };
  }, []);
  const handleFaucetChange = (e) => {
    const { name, value } = e.target;
    if (name === "address" && addressRegex.test(e.target.value)) {
      setFaucetField({
        ...faucetField,
        address: value,
      });
      setError((prevError) => ({
        ...prevError,
        address: "",
      }));
      setTxHash("");
    }
  };
  const requestFund = async () => {
    if (faucetField?.address === "") {
      setError({
        address: Messages?.ENTER_WALLET_ADDRESS,
      });
      return;
    }
    let valid = handleValidation(faucetField);
    if (valid.isValid == false && valid.temperror.address) {
      setError((prevError) => ({
        ...prevError,
        address: valid.temperror.address,
      }));
    } else {
      const data = {
        toAddress: faucetField.address,
        captchaToken: captchaToken,
      };
      setTransferStatus(FetchingStatus);
      await postFaucet(data)
        .then((res) => {
          if (res?.error == false) {
            setTxHash(res?.data?.txHash);
            toast.success(res?.message);
            setTransferStatus(SuccessStatus);
            setFaucetField({ address: "", amount: "" });
            handleReset();
          } else if (res?.error == true) {
            toast.error(res?.message);
            setTransferStatus(ErrorStatus);
            handleReset();
          }
        })
        .catch((err) => {
          toast.error(err?.message);
          setTransferStatus(ErrorStatus);
          handleReset();
        });
    }
    handleReset();
  };
  const handleReset = () => {
    if (recaptchaRef.current) recaptchaRef.current.reset();
    setCaptchaToken("");
  };
  return (
    <div className="faucet">
      <div className="container">
        <div className="searchblocks"></div>
        <div className="faucet_inner">
          {/* <SearchbarComponent
            searchStatus={searchStatus}
            setSerachStatus={setSerachStatus}
          /> */}
          <FilterResult />
          <div className="faucet_inner__top">
            <div className="left">
              <h3>Testnet Chain Faucet</h3>
              <p className="discription">
                Each address is eligible to receive <span>20 TICS Coins</span>{" "}
                per day.
              </p>

              <div>
                <Input
                  placeholder={validationtValue?.FAUCET_PLACEHOLDER}
                  type="text"
                  name="address"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      requestFund();
                    }
                    e.stopPropagation();
                  }}
                  value={faucetField?.address}
                  onChange={handleFaucetChange}
                  autoComplete="off"
                />
                {error?.address && (
                  <p
                    style={{
                      color: "red",
                      textAlign: "left",
                      paddingBottom: "0",
                      marginTop: "10px",
                      fontSize: "14px",
                    }}
                  >
                    {error?.address}
                  </p>
                )}
              </div>
              {/* <div className="space-top20 posRelative mb30">
                  <label>Amount</label>
                  <Input
                    placeholder={Messages?.FAUCET_AMOUNT_LIMIT}
                    type="number"
                    // inputMode="numeric"
                    name="amount"
                    value={faucetField?.amount}
                    onChange={handleFaucetChange}
                    // controls={false}
                    autoComplete="off"
                  />
                  {error?.amount && (
                    <p style={{ color: "red", textAlign: "left" }}>
                      {error?.amount}
                    </p>
                  )}
                  <p>{Messages?.Faucet_REQUEST_LIMIT}</p>
                  <div className="txHashStyle">
                    {txHash && (
                      <p>
                        <span>
                          <b> Tx Hash :</b>
                          <Link href={`tx/${txHash}`}>
                            <span style={{ color: "blue" }}>
                              {faucetAddress(txHash)}
                            </span>
                          </Link>
                        </span>
                        <span>
                          <CopyText text={txHash} />
                        </span>
                      </p>
                    )}
                  </div>
                </div> */}
              {GoogleKey && (
                <div className="captcha">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={GoogleKey}
                    onChange={(captcha) => {
                      if (captcha) setCaptchaToken(captcha);
                    }}
                  />
                </div>
              )}
              <div className="sendBtnFaucet">
                {transferStatus === FetchingStatus ? (
                  <button className="bluebtn">
                    <Spin
                      indicator={
                        <LoadingOutlined
                          style={{
                            fontSize: 24,
                          }}
                          spin
                        />
                      }
                    />
                  </button>
                ) : (
                  <button
                    disabled={!captchaToken}
                    onClick={requestFund}
                    className="headermetaBtn"
                    style={{ minWidth: "165px" }}
                  >
                    Send
                  </button>
                )}
              </div>
            </div>
            {/* <div className="right">
              <div className="right_inner">
                <p>
                  Use the button below to add Qubetics network to your metamask
                  wallet extension.{" "}
                </p>
                <button
                  className="qubeticNetwork_btn faucetmetabtn"
                  onClick={addQubetic}
                >
                  <span>
                    <Image
                      src="/metafox.avif"
                      width={25}
                      height={25}
                      alt="metafox"
                    />
                  </span>
                  Add {EXPLORER_CHAIN_NAME} Network
                </button>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
