import CountdownTimer from "@/components/countdown/CountdownTimer";
import { BLOCK_TIME } from "@/constant/constant";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Card, Tooltip } from "antd";
const CardsOnchain = (props) => {
  return (
    <>
      {/* <CardSkeleton /> */}
      <Card
        bordered={false}
        className={`marcketCapCard ${props.className} ${
          props?.addicon ? "addicon" : ""
        } ${props?.contract ? "contract" : ""} ${
          props?.countime ? "countime" : ""
        }`}
      >
        <div className="cardSec_items">
          <div className="cardsitem">
            <div className="imgIcon">{props?.img ? props?.img : ""}</div>

            <div>
              <p>
                {props?.text}
                {/* {props?.iconCopy == "true" ? ( */}
                <Tooltip
                  color="rgb(49 52 56)"
                  title={props?.title}
                  trigger="hover"
                >
                  <InfoCircleOutlined className="infoIcon" />
                </Tooltip>
                {/* ) : (
                  ""
                )} */}
              </p>
              <h2>
                {props.iconCopy2 ? (
                  <Tooltip color="rgb(49 52 56)" title="jcbdsjcbs">
                    <InfoCircleOutlined className="infoIcon" />
                  </Tooltip>
                ) : (
                  ""
                )}
                {props?.balance}
              </h2>
            </div>
          </div>
        </div>
        {props.countTimer ? (
          <div className="coiundown_withchart">
            <CountdownTimer time={BLOCK_TIME} countertext="Block Time" />
          </div>
        ) : (
          ""
        )}
      </Card>
    </>
  );
};

export default CardsOnchain;
