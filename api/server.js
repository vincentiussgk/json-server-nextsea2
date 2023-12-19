// See https://github.com/typicode/json-server#module
import axios from "axios";
import express from "express";
import { router as _router, defaults, rewriter } from "json-server";

const server = express();

// Uncomment to allow write operations
const fs = require("fs");
const path = require("path");
const filePath = path.join("db.json");
const data = fs.readFileSync(filePath, "utf-8");
const db = JSON.parse(data);
const router = _router(db);

const middlewares = defaults();

server.use(middlewares);
// Add this before server.use(router)
server.use(
  rewriter({
    "/api/*": "/$1",
    "/blog/:resource/:id/show": "/:resource/:id",
  })
);
server.use(router);

// Defining Custom APIs

server.get("/saved/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const response = await axios.get(`http://localhost:3000/bookmarks`, {
      params: {
        userId,
        _expand: "events",
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

server.listen(3000, () => {
  console.log("JSON Server is running");
});

// Export the Server API
export default server;
