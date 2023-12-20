// See https://github.com/typicode/json-server#module
const jsonServer = require("json-server");
const express = require("express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const server = express();

// Uncomment to allow write operations
const fs = require("fs");
const path = require("path");
const filePath = path.join("db.json");
const data = fs.readFileSync(filePath, "utf-8");
const db = JSON.parse(data);
const router = jsonServer.router(db);

const middlewares = jsonServer.defaults();

const port = 3001;

const apiUrl =
  process.env.NODE_ENV === "production"
    ? "https://next-be-samuel.vercel.app"
    : `http://localhost:${port}`;

const routeIndex = require("../routes/index");

// Add this before server.use(router)
server.use(
  jsonServer.rewriter({
    "/api/*": "/$1",
    "/blog/:resource/:id/show": "/:resource/:id",
  })
);

// Defining Custom APIs

Object.values(routeIndex).forEach((routeIndexItem) => {
  server.use(routeIndexItem);
});

const options = {
  definition: {
    openapi: "3.0.0",
    servers: [
      {
        url: apiUrl,
      },
    ],
  },
  apis: ["./routes/*.js"],
};
const specs = swaggerJsDoc(options);

server.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

server.use(middlewares);
server.use(router);

server.listen(port, () => {
  console.log("Server is running");
});

// Export the Server API
module.exports = server;
