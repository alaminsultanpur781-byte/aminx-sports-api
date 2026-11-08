
const ALLOWED_SPORTS = [
  "cricket",
  "football",
  "basketball",
  "tennis"
];

async function fetchProviderScores(sport = "cricket", limit = 20) {
  try {
    sport = String(sport).toLowerCase();

    if (!ALLOWED_SPORTS.includes(sport)) {
      throw new Error("Unsupported sport");
    }

    limit = Math.min(50, Math.max(1, Number(limit) || 20));

    const url = new URL(
      "https://sportscore.com/api/widget/matches/"
    );

    url.searchParams.set("sport", sport);
    url.searchParams.set("limit", String(limit));

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json"
      },
      signal: AbortSignal.timeout(15000)
    });

    if (!response.ok) {
      throw new Error(
        `SportScore API error: ${response.status}`
      );
    }

    const data = await response.json();

    return {
      success: true,
      configured: true,
      provider: "SportScore",
      sport,
      matches: data
    };

  } catch (error) {
    console.error("SportScore Error:", error.message);

    return {
      success: false,
      configured: true,
      provider: "SportScore",
      message: error.message,
      matches: []
    };
  }
}

module.exports = {
  fetchProviderScores
};
