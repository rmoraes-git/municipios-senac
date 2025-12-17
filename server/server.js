const express = require("express");
require("dotenv").config();

const cors = require('cors');

const municipiosRouter = require("./routes/municipios");

const autenticarAPIKey = require("./autorizar");

const app = express();
app.use(cors());
app.use(express.json());

app.use(autenticarAPIKey)
app.use("/municipios",  municipiosRouter);

// Rota raiz
app.get("/", (req, res) => {
  res.send("🌎 API de Municípios rodando! Acesse a documentação em /api-docs");
});

// =====================
// Servidor
// =====================
const PORT = process.env.PORT || 3000;

const pool = require("./db");

app.get("/health/db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() as agora");
    res.json({
      status: "db-ok",
      agora: result.rows[0].agora
    });
  } catch (err) {
    res.status(500).json({
      status: "db-error",
      message: err.message,
      code: err.code
    });
  }
});


app.listen(PORT,  () => {
  console.log("✅ Servidor rodando ");
});


