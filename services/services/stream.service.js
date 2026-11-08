const ALLOWED_PROTOCOLS = new Set(["https:"]);

function validateAuthorizedStreamUrl(value) {
  if (!value) return null;

  let url;

  try {
    url = new URL(value);
  } catch {
    throw new Error("Invalid stream URL.");
  }

  if (!ALLOWED_PROTOCOLS.has(url.protocol)) {
    throw new Error("Only HTTPS stream URLs are accepted.");
  }

  // Only use streams you own or are licensed to distribute.
  return url.toString();
}

module.exports = {
  validateAuthorizedStreamUrl
};
