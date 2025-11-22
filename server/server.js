import express from "express";
import cors from "cors";
app.use(cors());
import dotenv from "dotenv";
import { Mistral } from "@mistralai/mistralai";



dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new Mistral(process.env.MISTRAL_API_KEY);

app.post("/chat", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await client.chat.complete({
      model: "mistral-small-latest",
      messages: [{ role: "user", content: prompt }],
    });

    const reply = response.choices?.[0]?.message?.content || "No reply received";

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.json({ reply: "Server error: " + err.message });
  }
});

app.listen(4000, () =>
  console.log("Server running on http://localhost:4000")
);
