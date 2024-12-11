export const errorWarning = (contractDetailData) => {
  const parseError =
    contractDetailData?.errors !== undefined &&
    typeof contractDetailData?.errors === "string"
      ? JSON?.parse(contractDetailData?.errors)
      : contractDetailData?.errors;

  const showError =
    Array.isArray(parseError?.errors) && parseError?.errors.length > 0
      ? parseError.errors.map((error, index) => error?.formattedMessage)
      : null;

  const showWarning =
    Array.isArray(parseError?.warnings) && parseError?.warnings.length > 0
      ? parseError.warnings.map((error, index) => error?.formattedMessage)
      : null;

  const showMessages = showError ? showError : showWarning;
  return showMessages;
};
