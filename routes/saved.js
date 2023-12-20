const express = require("express");
const axios = require("axios");

const router = express.Router();

const port = 3001;
const apiUrl =
  process.env.NODE_ENV === "production"
    ? "https://next-be-samuel.vercel.app"
    : `http://localhost:${port}`;

/**
 * @swagger
 * /saved/{userId}:
 *   get:
 *     summary: Get a user's bookmarks along with event details
 *     description: Retrieves bookmarks by user ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     responses:
 *       '200':
 *         description: A successful response with saved items
 *       '500':
 *         description: Internal server error
 */
router.get("/saved/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const response = await axios.get(
      `${apiUrl}/bookmarks?userId=${userId ?? 1}&_expand=events`
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
