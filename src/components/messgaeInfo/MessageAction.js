import { getDVPNTypeKey } from "../header/helper";

const MessageAction = ({ data }) => {
  return (
    <>
      {data?.length > 0 &&
        data?.map((val, index) => (
          <div className="Transection__Action" key={index}>
            <div
              className="Transection__Action__details"
              style={{ marginTop: "15px" }}
            >
              <div>
                <p className="action actiondata">
                  {" "}
                  #{getDVPNTypeKey(val?.type)}
                </p>
                {/* <div>
                <p> {firstCapitalLetter(JSON?.parse(data?.input)?.name)} </p>
              </div> */}
              </div>

              <div style={{ marginTop: "15px" }}>
                <p className="action actiondata"> Type</p>
                <div>
                  <p>{val?.type || "-"}</p>
                </div>
              </div>

              <div style={{ marginTop: "15px" }}>
                <p className="action actiondata"> From</p>
                <div>
                  <p>{val?.accAddress || "-"}</p>
                </div>
              </div>

              <div style={{ marginTop: "15px" }}>
                <p className="action actiondata"> Block No.</p>
                <div>
                  <p>{val?.blocknumber || "-"}</p>
                </div>
              </div>

              <div style={{ marginTop: "15px" }}>
                <p className="action actiondata"> Node Adress</p>
                <div>
                  <p>{val?.nodeAddress || "-"}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

export default MessageAction;
