import { format } from "date-fns";
import moment from "moment";

const renderTime = (date) => {
  let dateObj = new Date(date);
  let dates;
  if (isNaN(dateObj)) {
    dates = Number(date);
  } else {
    dates = dateObj.getTime();
  }
  let timeLeft;
  let time = Date.now();

  const newDate = (time - dates) / 1000;
  if (newDate < 60) timeLeft = `${newDate.toFixed(0)}s ago`;
  else if (newDate >= 60 && newDate <= 3600)
    timeLeft = `${(newDate / 60).toFixed(0)}m ago`;
  else if (newDate >= 3600 && newDate <= 86400)
    timeLeft = `${(newDate / 3600).toFixed(0)}h ago`;
  else if (newDate >= 86400 && newDate <= 2592000)
    timeLeft = `${(newDate / 86400).toFixed(0)}d ago`;
  else if (newDate > 0) timeLeft = moment(dates).fromNow();

  return timeLeft;
};

const convertToDateTime = (date) => {
  let dateObj = new Date(date);
  let dates;
  if (isNaN(dateObj)) {
    dates = Number(date);
  } else {
    dates = dateObj.getTime();
  }
  let timeLeft = moment(dates).format("MMM D, YYYY HH:mm");
  return timeLeft;
};

const formatDate = (date) => {
  const inputTimestamp = new Date(date);
  const formattedDate = format(inputTimestamp, "MMM do yyyy, HH:mm:ss");
  return formattedDate;
};

export { renderTime, convertToDateTime, formatDate };
