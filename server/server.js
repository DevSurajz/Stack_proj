import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Mistral } from "@mistralai/client";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY
});

app.post("/chat", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await client.chat.complete({
      model: "mistral-small-latest",
      messages: [
        { role: "user", content: prompt }
      ]
    });

    res.json({
      reply: response.output_text
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(process.env.PORT || 4000, () =>
  console.log("Server running...")
);
