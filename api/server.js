const jsonServer = require("json-server");
const express = require("express");
const bodyParser = require("body-parser");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const cors = require("cors");

const server = express();

const fs = require("fs");
const path = require("path");
const filePath = path.join("db.json");
const data = fs.readFileSync(filePath, "utf-8");
const db = JSON.parse(data);

const middlewares = jsonServer.defaults();
const router = jsonServer.router(db);

const port = 3001;

const apiUrl =
  process.env.NODE_ENV === "production"
    ? "https://next-be-samuel.vercel.app"
    : `http://localhost:${port}`;

const routeIndex = require("../routes/index");

server.use(cors());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

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

// Add this before server.use(router)
server.use(
  jsonServer.rewriter({
    "/api/*": "/$1",
    "/blog/:resource/:id/show": "/:resource/:id",
  })
);

// Use the JSON server router
server.use(router);

server.listen(port, () => {
  console.log("Server is running");
});

// Export the Server API
module.exports = server;
