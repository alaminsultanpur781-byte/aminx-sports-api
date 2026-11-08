function errorHandler(err, req, res, next) {
  console.error("API error:", err.message || err);

  const status = err.status || 500;

  res.status(status).json({
    success: false,
    message:
      status >= 500 && status !== 503
        ? "Internal server error."
        : err.message
  });
}

module.exports = {
  errorHandler
};
