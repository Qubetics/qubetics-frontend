import { randomNoGenerator } from "@/utils/commonFunctions";
import React, { useEffect, useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

const renderTime = ({ remainingTime }) => {
  const [randomValue, setRandomValue] = useState(randomNoGenerator());

  const setTime = () => {
    setTimeout(() => {
      const newValue = randomNoGenerator();
      setRandomValue(newValue);
      setTime();
    }, 1000);
  };

  useEffect(() => {
    setTime();
    return () => {
      clearTimeout(setTime);
    };
  }, []);

  return (
    <div className="timer">
      <div className="value">{randomValue} Sec</div>
      Round Time
    </div>
  );
};

const CountdownTimer = (props) => {
  return (
    <div className="countdowncircle">
      <CountdownCircleTimer
        isPlaying
        duration={props?.time}
        maxWidth={"10px"}
        colors={["#01a9fb"]}
        onComplete={() => ({ shouldRepeat: true, delay: 0 })}
      >
        {renderTime}
      </CountdownCircleTimer>
      {props.countertext ? <p>{props.countertext}</p> : ""}
    </div>
  );
};
export default CountdownTimer;
