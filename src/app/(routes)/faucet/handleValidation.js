import { Messages, validationtValue } from "@/constant/constant";

export const handleValidation = (data) => {
  console.log(data);
  
  let temperror = {};
  let isValid = true;

  for (let [key, value] of Object.entries(data)) {
    switch (key) {
      case "address": // You should compare 'key' to the string "address"
        if (value === "" || value.length === 0) {
          temperror["address"] = Messages.ENTER_WALLET_ADDRESS;
          isValid = false;
        } else if (!value.startsWith(validationtValue.START_ADDRESS)) {
          temperror["address"] = Messages.INVALID_ADDRESS;
          isValid = false;
        } else {
          temperror["address"] = "";
        }
        break;

      case "amount": // You should compare 'key' to the string "amount"
        if (value === "" || value.length === 0) {
          temperror["amount"] = Messages.ENTER_AMOUNT;
          isValid = false;
        } else if (
          isNaN(value) === true ||
          Number(value) <= 0 ||
          Number(value) > validationtValue.FACUCET_AMOUNT_UPTO
        ) {
          if (Number(value) > validationtValue.FACUCET_AMOUNT_UPTO) {
            temperror["amount"] = Messages.MAX_VALUE_EXCEED;
          } else {
            temperror["amount"] = Messages.INVALID_AMOUNT;
          }
          isValid = false;
        } else {
          temperror["amount"] = "";
        }
        break;

      default:
        temperror[key] = `Invalid ${key}`;
        isValid = false;
        break;
    }
  }

  return { temperror, isValid };
};
