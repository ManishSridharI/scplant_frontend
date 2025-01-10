const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = app => {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://scplant-server:8000',
      pathRewrite: {
        '^/api': '', // Remove /api from the beginning of the path
      },
      secure: false,
      changeOrigin: true,
      onError: (err, req, res) => console.log("Error messages: " + err)
    })
  );
};