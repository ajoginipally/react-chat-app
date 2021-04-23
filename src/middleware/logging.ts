const loggingMiddleware = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method}:${req.url} - ${res.statusCode}`);
  next();
};

export default loggingMiddleware;
