const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const pkg = require("@mistralai/mistralai");

dotenv.config();

const { MistralClient } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const client = new MistralClient(process.env.MISTRAL_API_KEY);

app.post("/chat", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await client.chat({
      model: "mistral-tiny",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ error: "internal error" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("Server running on port", PORT));
