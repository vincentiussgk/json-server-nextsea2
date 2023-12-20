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
 * /register:
 *   post:
 *     summary: Attempts to create a new account if the email doesn't exist.
 *     description: Creates a new account.
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

router.post("/register", async (req, res) => {
  try {
    const { email } = req.body;

    const response = await axios.get(`${apiUrl}/users?email=${email}`);

    if (response.data.length !== 0) {
      const error = new Error("Email already exists");
      error.status = 401;
      throw error;
    }

    const createUserResponse = await axios.post(`${apiUrl}/users`, {
      membership: null,
      role: 2,
      balance: 0,
      image: "",
      ...req.body,
    });

    res.json(createUserResponse.data);
  } catch (error) {
    res.status(error.status).json({
      status: error.status,
      message: error.message,
    });
  }
});

module.exports = router;
