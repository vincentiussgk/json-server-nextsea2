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
 * /purchases/{userId}:
 *   get:
 *     summary: Get a user's purchase history along with event details
 *     description: Retrieves purchases by user ID
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
router.get("/history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const response = await axios.get(
      `${apiUrl}/purchases?_expand=event&userId=${userId}`
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
