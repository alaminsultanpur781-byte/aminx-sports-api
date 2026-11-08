async function fetchProviderScores() {
  if (!process.env.SPORTS_DATA_API_KEY) {
    return {
      configured: false,
      message: "No sports data provider configured. Update scores through the admin API."
    };
  }

  return {
    configured: true,
    message: "Provider key detected; provider adapter still needs provider-specific implementation."
  };
}

module.exports = {
  fetchProviderScores
};
