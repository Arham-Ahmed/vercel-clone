const express = require("express");
const httpProxy = require("http-proxy");

const app = express();
const PORT = 7000;

const proxy = httpProxy.createProxy();
// let BASE_PATH = "http://localhost:3000"; // Default BASE_PATH
let BASE_PATH; // Default BASE_PATH

app.use((req, res) => {
  // Example: You might want to extract it from the request or perform a DB query
  const hostname = req.hostname;
  const subdomain = hostname.split(".")[0];

  const url = req.url?.trim();
  console.log("🚀 ~ app.use ~ url === ", typeof url);
  if (url === "api1") {
    // Example: You can use subdomain to dynamically set BASE_PATH
    BASE_PATH = "http://localhost:3001";
  } else if (url === "api1") {
    BASE_PATH = "http://localhost:3002";
  }
  console.log("🚀 ~ app.use ~ BASE_PATH:", BASE_PATH);

  // Proxy the request to the determined BASE_PATH
  return proxy.web(req, res, { target: BASE_PATH, changeOrigin: true });
});

proxy.on("proxyReq", (proxyReq, req, res) => {
  // You can still modify the request if needed
  const url = req.url;
  if (url === "/3000") proxyReq.path = "http://localhost:3000";
  console.log("🚀 ~ proxy.on ~ url:", proxyReq.path);
  if (url === "/5000") proxyReq.path = "/";
  console.log("🚀 ~ proxy.on ~ url:", proxyReq.path);
});

app.listen(PORT, () =>
  console.log(`Reverse Proxy Server running on http://localhost:${PORT}`)
);
