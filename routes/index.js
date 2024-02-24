const express = require("express");
const router = express.Router();
[].forEach((routerObject) => {
  const middlewareFunctions = routerObject?.middleware?.map((middleware) => {
    return (req, res, next) => {
      middleware(req, res, next);
    };
  });
  router[routerObject.method](
    routerObject?.path,
    middlewareFunctions,
    routerObject?.handler
  );
});

module.exports = router;
