// See https://github.com/typicode/json-server#module
import { create, router as _router, defaults, rewriter } from "json-server";

const server = create();

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
server.listen(3000, () => {
  console.log("JSON Server is running");
});

// Export the Server API
export default server;
