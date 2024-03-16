export const subModules = (ReqData: any[], existingData?: any[]): any[] => {
  const existingDetails: any[] = existingData || [];

  for (const reqAccounts of ReqData) {
    if (reqAccounts._id) {
      const matchingExisting = existingDetails.find(
        (existingAcc) => JSON.stringify(existingAcc._id) === JSON.stringify(reqAccounts._id)
      );

      if (matchingExisting) {
        Object.assign(matchingExisting, reqAccounts);
      } else {
        existingDetails.push({ ...reqAccounts });
      }
    } else {
      existingDetails.push({ ...reqAccounts });
    }
  }

  return existingDetails;
};
