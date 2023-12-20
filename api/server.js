const jsonServer = require("json-server");
const express = require("express");
const bodyParser = require("body-parser");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const cors = require("cors");

const expressApp = express();
const jsonServerApp = jsonServer.create();

const port = 3001;

const apiUrl =
  process.env.NODE_ENV === "production"
    ? "https://next-be-samuel.vercel.app"
    : `http://localhost:${port}`;

const routeIndex = require("../routes/index");

expressApp.use(cors());
expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({ extended: true }));

// Defining Custom APIs
Object.values(routeIndex).forEach((routeIndexItem) => {
  expressApp.use(routeIndexItem);
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

expressApp.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

const middlewares = jsonServer.defaults();

jsonServerApp.use(middlewares);

// Add this before jsonServerApp.use(jsonServer.router(db))
jsonServerApp.use(
  jsonServer.rewriter({
    "/api/*": "/$1",
    "/blog/:resource/:id/show": "/:resource/:id",
  })
);

const fs = require("fs");
const path = require("path");
const filePath = path.join("db.json");
const data = fs.readFileSync(filePath, "utf-8");
const db = JSON.parse(data);

jsonServerApp.use(jsonServer.router(db));

expressApp.listen(port + 1, () => {
  console.log("Express Server is running");
});

jsonServerApp.listen(port, () => {
  console.log("JSON Server is running on port", port + 1);
});

// Export the Express App
module.exports = jsonServerApp;
