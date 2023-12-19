// See https://github.com/typicode/json-server#module
const jsonServer = require("json-server");
const axios = require("axios");
const express = require("express");

const server = express();

// Uncomment to allow write operations
const fs = require("fs");
const path = require("path");
const filePath = path.join("db.json");
const data = fs.readFileSync(filePath, "utf-8");
const db = JSON.parse(data);
const router = jsonServer.router(db);

const middlewares = jsonServer.defaults();

// Add this before server.use(router)
server.use(
  jsonServer.rewriter({
    "/api/*": "/$1",
    "/blog/:resource/:id/show": "/:resource/:id",
  })
);

// Defining Custom APIs

server.get("/saved/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const response = await axios.get(
      `http://localhost:3000/bookmarks?userId=${userId}&_expand=events`
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

server.use(middlewares);
server.use(router);

server.listen(3000, () => {
  console.log("Server is running");
});

// Export the Server API
module.exports = server;
