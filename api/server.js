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

const port = 3001;

const apiUrl =
  process.env.NODE_ENV === "production"
    ? "https://next-be-samuel.vercel.app"
    : `http://localhost:${port}`;

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
    console.log("hi", req?.params);
    const { userId } = req.params;

    console.log(userId);

    const response = await axios.get(
      `${apiUrl}/bookmarks?userId=${userId ?? 1}&_expand=events`
    );

    console.log(response);

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

server.use(middlewares);
server.use(router);

server.listen(port, () => {
  console.log("Server is running");
});

// Export the Server API
module.exports = server;
