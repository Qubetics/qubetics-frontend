import { BUG_REPORT_API } from "@/constant/constant";
import { toast } from "react-toastify";

export default async function postBugReport(
  fieldData,
  selectedApplication,
  selectedBugType,
  captchaToken,
  selectedFiles
) {
  console.log(selectedFiles, fieldData);
  const bugData = new FormData();
  bugData.append("name", fieldData.name);
  bugData.append("email", fieldData.email_address);
  bugData.append("walletAddress", fieldData.wallet_address);
  bugData.append("detailedDescription", fieldData.description);
  bugData.append("telegramId", fieldData.telegram_id);
  bugData.append("applicationTested", selectedApplication);
  bugData.append("bugType", selectedBugType);
  bugData.append("severity", fieldData.severity);
  bugData.append("additionalComments", fieldData.additional_comments);
  bugData.append("captchaToken", captchaToken);
  bugData.append("attachments", selectedFiles[0]);

  try {
    const response = await fetch(`${BUG_REPORT_API}bug-bounty/submit-bug`, {
      method: "POST",
      body: bugData,
      // headers: {
      //   "Content-Type": "application/json",
      // },
    });

    let result = await response.json();
    return result;
  } catch (error) {
    toast.error(error);
    return error;
  }
}
