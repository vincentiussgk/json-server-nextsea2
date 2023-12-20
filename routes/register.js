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
    const { email, name, role, password } = req.body;

    const response = await axios.get(`${apiUrl}/users?email=${email}`);

    if (response.data.length !== 0) {
      const error = new Error("Email already exists");
      error.status = 401;
      throw error;
    }

    // ngepost

    res.json(response.data[0]);
  } catch (error) {
    console.error(error);
    res.status(error.status).json({ error });
  }
});

module.exports = router;
