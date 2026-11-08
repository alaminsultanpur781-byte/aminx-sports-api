// Adapter point for a licensed sports-data provider.
// Keep provider API keys on the server. Never scrape unauthorized sources.
async function fetchProviderScores() {
  if (!process.env.SPORTS_DATA_API_KEY) {
    return {
      configured: false,
      message: "No sports data provider configured. Update scores through the admin API."
    };
  }

  // Add the provider-specific HTTPS request here after choosing a provider.
  // Different providers use different URLs, authentication and response schemas.
  return {
    configured: true,
    message: "Provider key detected; provider adapter still needs provider-specific implementation."
  };
}

module.exports = { fetchProviderScores };
