import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json());

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.get("/", (req, res) => {
  res.send("backend alive");
});

app.post("/narrate", async (req, res) => {
  try {
    const { title, description = "", tone = "friendly" } = req.body ?? {};

    if (!title) {
      return res.status(400).json({ error: "Missing 'title' in body" });
    }

    // Responses API (recommended for new projects) :contentReference[oaicite:2]{index=2}
    const response = await client.responses.create({
      model: "gpt-5-mini",
      input: `You are a tour guide. Write a ${tone} short narration about "${title}". Use this context if provided: ${description}`,
    });

    // SDK returns output text via output_text helper in many examples.
    // If your SDK version differs, check response.output / response.output_text.
    const text = response.output_text ?? "";

    return res.json({ narration: text });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Narration failed" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});
