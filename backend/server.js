const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const dbConfig = {
  host: process.env.DB_HOST || "db",
  user: process.env.DB_USER || "hyrox",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "hyrox_protocol",
  waitForConnections: true,
  connectionLimit: 10
};

let pool;

function getPool() {
  if (!pool) pool = mysql.createPool(dbConfig);
  return pool;
}

async function waitForDB(retries = 20, delay = 2000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await getPool().query("SELECT 1");
      console.log("DB connected");
      return;
    } catch {
      console.log(`DB not ready, retrying (${attempt}/${retries})...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error("Could not connect to database");
}

async function initDB() {
  const db = getPool();
  await db.query(`
    CREATE TABLE IF NOT EXISTS profiles (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS progress_state (
      profile_id VARCHAR(64) PRIMARY KEY,
      data JSON NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
    )
  `);

  await db.query(
    "INSERT IGNORE INTO profiles (id, name) VALUES (?, ?)",
    ["default", "8-Week 5K Build"]
  );

  console.log("DB initialised");
}

app.get("/api/health", async (req, res) => {
  try {
    await getPool().query("SELECT 1");
    res.json({ ok: true, db: true });
  } catch (error) {
    res.status(503).json({ ok: false, db: false, error: error.message });
  }
});

app.get("/api/profile/:id", async (req, res) => {
  try {
    const [rows] = await getPool().query(
      "SELECT id, name, created_at, updated_at FROM profiles WHERE id = ?",
      [req.params.id]
    );
    res.json(rows[0] || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/state/:profileId", async (req, res) => {
  try {
    await getPool().query(
      "INSERT IGNORE INTO profiles (id, name) VALUES (?, ?)",
      [req.params.profileId, "8-Week 5K Build"]
    );
    const [rows] = await getPool().query(
      "SELECT data FROM progress_state WHERE profile_id = ?",
      [req.params.profileId]
    );
    res.json(rows[0]?.data || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/state/:profileId", async (req, res) => {
  try {
    await getPool().query(
      "INSERT IGNORE INTO profiles (id, name) VALUES (?, ?)",
      [req.params.profileId, "8-Week 5K Build"]
    );
    await getPool().query(
      `INSERT INTO progress_state (profile_id, data)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE data = VALUES(data)`,
      [req.params.profileId, JSON.stringify(req.body || {})]
    );
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/state/:profileId", async (req, res) => {
  try {
    await getPool().query(
      "DELETE FROM progress_state WHERE profile_id = ?",
      [req.params.profileId]
    );
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

waitForDB()
  .then(initDB)
  .then(() => app.listen(4000, () => console.log("API running on :4000")))
  .catch(error => {
    console.error("Startup failed:", error);
    process.exit(1);
  });
