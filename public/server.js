const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
const RATE_LIMIT = Number(process.env.RATE_LIMIT || 40); // requêtes par minute et par IP

// Derrière le proxy de Render, req.ip doit être la vraie IP du visiteur
app.set("trust proxy", 1);
app.use(express.json({ limit: "1mb" }));

/* ---------- CORS ----------
   L'application Android tourne sur https://localhost : sans ces en-têtes,
   le navigateur intégré bloque les appels vers ton serveur Render.
   On n'autorise que ces origines (pas "*"), car ce serveur dépense ton quota Groq.
   Pour ajouter une origine : variable d'environnement ALLOWED_ORIGINS="https://a.com,https://b.com" */
const DEFAULT_ORIGINS = ["https://localhost", "http://localhost", "capacitor://localhost", "ionic://localhost"];
const EXTRA_ORIGINS = (process.env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && (DEFAULT_ORIGINS.includes(origin) || EXTRA_ORIGINS.includes(origin) || /^http:\/\/localhost:\d+$/.test(origin))) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Max-Age", "86400");
  }
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

/* ---------- Limite de requêtes (en mémoire) ---------- */
const hits = new Map();
function rateLimit(req, res, next) {
  const now = Date.now();
  const recent = (hits.get(req.ip) || []).filter((t) => now - t < 60000);
  if (recent.length >= RATE_LIMIT) {
    return res.status(429).json({ error: { message: "Trop de requêtes, réessaie dans une minute." } });
  }
  recent.push(now);
  hits.set(req.ip, recent);
  next();
}
setInterval(() => {
  const now = Date.now();
  for (const [ip, arr] of hits) if (!arr.some((t) => now - t < 60000)) hits.delete(ip);
}, 5 * 60 * 1000).unref();

app.use(express.static(path.join(__dirname, "public")));

// L'appli demande si l'IA est disponible (sans jamais voir la clé)
app.get("/api/status", (req, res) => {
  res.json({ ai: !!GROQ_API_KEY });
});

function validMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 24) return false;
  return messages.every((m) => m && ["system", "user", "assistant"].includes(m.role) && typeof m.content === "string" && m.content.length <= 6000);
}

app.post("/api/chat", rateLimit, async (req, res) => {
  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: { message: "Clé GROQ_API_KEY manquante côté serveur." } });
  }
  const { messages, temperature = 0.5, response_format } = req.body || {};
  if (!validMessages(messages)) {
    return res.status(400).json({ error: { message: "Paramètre messages invalide." } });
  }
  const body = { model: GROQ_MODEL, messages, temperature: Math.min(1.2, Math.max(0, Number(temperature) || 0.5)) };
  if (response_format && response_format.type === "json_object") body.response_format = { type: "json_object" };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${GROQ_API_KEY}` },
      body: JSON.stringify(body),
      signal: controller.signal
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);
    res.json(data);
  } catch (err) {
    console.error("Erreur proxy :", err.name === "AbortError" ? "délai dépassé" : err);
    res.status(err.name === "AbortError" ? 504 : 500).json({ error: { message: err.name === "AbortError" ? "L'IA a mis trop de temps à répondre." : "Erreur interne du serveur proxy." } });
  } finally {
    clearTimeout(timer);
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
