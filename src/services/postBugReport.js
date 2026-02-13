import { BUG_REPORT_API } from "@/constant/constant";
import { customToast } from "@/components/common/toast";

export default async function postBugReport(
  fieldData,
  selectedApplication,
  selectedBugType,
  captchaToken,
  selectedFiles
) {
  const bugData = new FormData();
  selectedFiles?.forEach((files) => {
    bugData.append("attachments", files);
  });
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

  try {
    const response = await fetch(`${BUG_REPORT_API}bug-bounty/submit-bug`, {
      method: "POST",
      body: bugData,
    });

    return response;
  } catch (error) {
    customToast.error(error);
    return error;
  }
}
