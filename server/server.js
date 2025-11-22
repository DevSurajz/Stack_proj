import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: "mistral-large-latest",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();

    res.json({ reply: data.choices[0].message.content });

  } catch (err) {
    console.error(err);
    res.json({ reply: "Server error" });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log("Server running on port " + port));
