function isOptionDisable(activationDate, validityPeriodDays) {
    const activationDateObj = new Date(activationDate);
    const expirationDate = new Date(activationDateObj);
    expirationDate.setDate(activationDateObj.getDate() + validityPeriodDays);
    const currentDate = new Date();
    return currentDate <= expirationDate;
}


export default isOptionDisable



