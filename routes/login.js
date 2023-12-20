const express = require("express");
const axios = require("axios");

const router = express.Router();

const port = 3001;
const apiUrl =
  process.env.NODE_ENV === "production"
    ? "https://next-be-samuel.vercel.app:3001"
    : `http://localhost:${port}`;

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Attempts to log in the application using provided details.
 *     description: Logs in with given credentials.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User email
 *               password:
 *                 type: string
 *                 description: User password
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

    console.log(response.data[0]);

    res.json(response.data[0]);
  } catch (error) {
    res.status(error.status).json({
      status: error.status,
      message: error.message,
    });
  }
});

module.exports = router;
