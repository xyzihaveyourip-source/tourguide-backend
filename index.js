import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/narrate", async (req, res) => {
  const { poiName, description, tone } = req.body;

  if (!poiName || !description) {
    return res.status(400).json({ error: "Missing data" });
  }

  const prompt = `
You are a professional tour guide.

Tone: ${tone ?? "informative, friendly"}
Location: ${poiName}

Description:
${description}

Create a spoken-style narration (150–200 words).
No emojis. No bullet points.
Address the listener directly.
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    res.json({ narration: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: "AI failure" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

