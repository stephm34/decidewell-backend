// api/claude.js

import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/claude", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.CLAUDE_API_KEY,
        "content-type": "application/json",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-opus-20240229",
        max_tokens: 1024,
        temperature: 0.5,
        system: "You are a helpful assistant that evaluates decisions.",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();

    res.status(200).json({ result: data?.content?.[0]?.text || "No response" });
  } catch (error) {
    console.error("Claude API Error:", error);
    res.status(500).json({ result: "Error connecting to Claude API." });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
