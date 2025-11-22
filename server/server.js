import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MistralClient } from "@mistralai/mistralai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new MistralClient(process.env.MISTRAL_API_KEY);

app.post("/chat", async (req, res) => {
  try {
    const prompt = req.body.prompt || "";

    const response = await client.chat.complete({
      model: "mistral-large-latest",
      messages: [
        { role: "user", content: prompt }
      ]
    });

    res.json({ reply: response.choices[0].message.content });

  } catch (err) {
    console.error("API Error:", err);
    res.json({ reply: "Server error" });
  }
});


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

