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
 * /login:
 *   post:
 *     summary: Attempts to log in the application using provided details.
 *     description: Logs in with given credentials.
 *     parameters:
 *       - in: path
 *          email: user email
 *          password: user password
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     responses:
 *       '200':
 *         description: A successful response with saved items
 *       '500':
 *         description: Internal server error
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const response = await axios.get(`${apiUrl}/users?email=${email}`);

    if (!response?.data || response?.data.length === 0) {
      const error = new Error("User not found!");
      error.status = 404;
      throw error;
    }

    if (response?.data?.[0].password !== password) {
      const error = new Error("Wrong password provided!");
      error.status = 401;
      throw error;
    }

    res.json(response.data[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

module.exports = router;
