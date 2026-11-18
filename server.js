const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

// Le navigateur demande si l'IA est disponible (sans jamais voir la clé)
app.get("/api/status", (req, res) => {
  res.json({ ai: !!GROQ_API_KEY });
});

app.post("/api/chat", async (req, res) => {
  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: { message: "Clé GROQ_API_KEY manquante côté serveur." } });
  }
  try {
    const { messages, temperature = 0.5, response_format } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: { message: "Paramètre messages invalide." } });
    }
    const body = { model: GROQ_MODEL, messages, temperature };
    if (response_format) body.response_format = response_format;

    const response = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);
    res.json(data);
  } catch (err) {
    console.error("Erreur proxy :", err);
    res.status(500).json({ error: { message: "Erreur interne du serveur proxy." } });
  }
});

// Fallback : renvoie index.html pour toutes les autres routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ LinguaAI tourne sur http://localhost:${PORT}`);
  console.log(`   Clé API ${GROQ_API_KEY ? "présente ✔" : "absente ✘ (définis GROQ_API_KEY)"}`);
});