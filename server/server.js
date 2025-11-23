import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();


app.use(cors({
  origin: ['https://lunarso.vercel.app/', 'http://localhost:5173'],
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());


app.get("/", (req, res) => {
  res.json({ 
    message: "Backend is running!",
    endpoints: {
      chat: "POST /chat"
    }
  });
});


app.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ reply: "Prompt is required" });
    }

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

    if (!response.ok) {
      throw new Error(`Mistral API error: ${response.status}`);
    }

    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });

  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ 
      reply: "Server error. Please try again.",
      error: err.message 
    });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});