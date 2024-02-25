const express = require("express");
const httpProxy = require("http-proxy");

const app = express();
const PORT = 7000;

const BASE_PATH = "http://localhost:3000";

const proxy = httpProxy.createProxy();

app.use((req, res) => {
  const hostname = req.hostname;
  const subdomain = hostname.split(".")[0];

  // Custom Domain - DB Query

  const resolvesTo = `${BASE_PATH}/api/v1/`;

  proxy.web(req, res, { target: resolvesTo, changeOrigin: true });
});

proxy.on("proxyReq", (proxyReq, req, res) => {
  //   const url = req.url;
  //   if (url === "/") proxyReq.path += "index.html";
});

app.listen(PORT, () =>
  console.log(`Reverse Proxy Server running on http://localhost:${PORT}`)
);
