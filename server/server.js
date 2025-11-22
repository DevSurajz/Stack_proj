import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import MistralClient from "@mistralai/mistralai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new MistralClient(process.env.MISTRAL_API_KEY);

app.post("/chat", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await client.chat({
      model: "mistral-tiny",
      messages: [
        { role: "user", content: prompt }
      ]
    });

    res.json({
      reply: response.choices[0].message.content
    });

  } catch (e) {
    console.error(e);
    res.json({ reply: "Error" });
  }
});

app.listen(process.env.PORT || 4000, () => {
  console.log("Server Running");
});
