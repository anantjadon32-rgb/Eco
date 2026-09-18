require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

const app = express();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const PORT = Number(process.env.PORT) || 3000;
const FILE_ROOT = "D:\\NAS\\ECO-Files";

fs.mkdirSync(FILE_ROOT, { recursive: true });

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
  ]
}));

app.use(express.json());

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function createToken() {
  return crypto.randomBytes(32).toString("hex");
}

async function createSession(userId) {
  const token = createToken();

  await pool.query(
    `INSERT INTO sessions
     (id, user_id, token_hash, expires_at)
     VALUES ($1, $2, $3, NOW() + INTERVAL '30 days')`,
    [crypto.randomUUID(), userId, hashToken(token)]
  );

  return token;
}

async function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization || "";

    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({
        ok: false,
        message: "Authentication required."
      });
    }

    const token = header.slice(7).trim();

    const result = await pool.query(
      `SELECT
         s.id AS session_id,
         u.id,
         u.name,
         u.email,
         u.created_at
       FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = $1
       AND s.expires_at > NOW()`,
      [hashToken(token)]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        ok: false,
        message: "Invalid or expired session."
      });
    }

    req.sessionId = result.rows[0].session_id;
    req.user = result.rows[0];

    next();
  } catch (error) {
    console.error("Auth error:", error.message);

    res.status(500).json({
      ok: false,
      message: "Authentication error."
    });
  }
}

/* HEALTH */

app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS time");

    res.json({
      ok: true,
      service: "ECO Backend",
      database: "connected",
      time: result.rows[0].time
    });
  } catch (error) {
    console.error("Database error:", error.message);

    res.status(500).json({
      ok: false,
      service: "ECO Backend",
      database: "disconnected"
    });
  }
});

/* SIGNUP */

app.post("/api/auth/signup", async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!name || !email || !password) {
      return res.status(400).json({
        ok: false,
        message: "Name, email and password are required."
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        ok: false,
        message: "Password must be at least 8 characters."
      });
    }

    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        ok: false,
        message: "An account with this email already exists."
      });
    }

    const userId = crypto.randomUUID();
    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO users
       (id, name, email, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, created_at`,
      [userId, name, email, passwordHash]
    );

    const user = result.rows[0];
    const token = await createSession(user.id);

    res.status(201).json({
      ok: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error("Signup error:", error.message);

    res.status(500).json({
      ok: false,
      message: "Account creation failed."
    });
  }
});

/* LOGIN */

app.post("/api/auth/login", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: "Email and password are required."
      });
    }

    const result = await pool.query(
      `SELECT id, name, email, password_hash, created_at
       FROM users
       WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        ok: false,
        message: "Invalid email or password."
      });
    }

    const user = result.rows[0];

    const validPassword = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!validPassword) {
      return res.status(401).json({
        ok: false,
        message: "Invalid email or password."
      });
    }

    const token = await createSession(user.id);

    res.json({
      ok: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error("Login error:", error.message);

    res.status(500).json({
      ok: false,
      message: "Login failed."
    });
  }
});

/* ME */

app.get("/api/auth/me", authMiddleware, (req, res) => {
  res.json({
    ok: true,
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      createdAt: req.user.created_at
    }
  });
});

/* LOGOUT */

app.post("/api/auth/logout", authMiddleware, async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM sessions WHERE id = $1",
      [req.sessionId]
    );

    res.json({
      ok: true,
      message: "Logged out successfully."
    });
  } catch (error) {
    console.error("Logout error:", error.message);

    res.status(500).json({
      ok: false,
      message: "Logout failed."
    });
  }
});

/* PROJECTS - LIST */

app.get("/api/projects", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, description, created_at, updated_at
       FROM projects
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json({
      ok: true,
      projects: result.rows
    });
  } catch (error) {
    console.error("Projects error:", error.message);

    res.status(500).json({
      ok: false,
      message: "Could not load projects."
    });
  }
});

/* PROJECTS - CREATE */

app.post("/api/projects", authMiddleware, async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const description = String(req.body.description || "").trim();

    if (!name) {
      return res.status(400).json({
        ok: false,
        message: "Project name is required."
      });
    }

    const result = await pool.query(
      `INSERT INTO projects
       (id, user_id, name, description)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, description, created_at, updated_at`,
      [
        crypto.randomUUID(),
        req.user.id,
        name,
        description
      ]
    );

    res.status(201).json({
      ok: true,
      project: result.rows[0]
    });
  } catch (error) {
    console.error("Project create error:", error.message);

    res.status(500).json({
      ok: false,
      message: "Could not create project."
    });
  }
});

/* PROJECTS - DELETE */

app.delete("/api/projects/:id", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM projects
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "Project not found."
      });
    }

    res.json({
      ok: true,
      message: "Project deleted."
    });
  } catch (error) {
    console.error("Project delete error:", error.message);

    res.status(500).json({
      ok: false,
      message: "Could not delete project."
    });
  }
});

/* FILE UPLOAD */

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024
  }
});

app.post(
  "/api/files/upload",
  authMiddleware,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          ok: false,
          message: "No file uploaded."
        });
      }

      const userDirectory = path.join(
        FILE_ROOT,
        req.user.id
      );

      fs.mkdirSync(userDirectory, { recursive: true });

      const safeName = path
        .basename(req.file.originalname)
        .replace(/[^\w.\- ()]/g, "_");

      const storedName =
        `${crypto.randomUUID()}-${safeName}`;

      const fullPath = path.join(
        userDirectory,
        storedName
      );

      fs.writeFileSync(fullPath, req.file.buffer);

      const relativePath = path.relative(
        FILE_ROOT,
        fullPath
      );

      const result = await pool.query(
        `INSERT INTO files
         (id, user_id, original_name, stored_name,
          file_path, mime_type, size_bytes)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, original_name, mime_type,
                   size_bytes, created_at`,
        [
          crypto.randomUUID(),
          req.user.id,
          safeName,
          storedName,
          relativePath,
          req.file.mimetype || null,
          req.file.size
        ]
      );

      res.status(201).json({
        ok: true,
        file: result.rows[0]
      });
    } catch (error) {
      console.error("File upload error:", error.message);

      res.status(500).json({
        ok: false,
        message: "File upload failed."
      });
    }
  }
);

/* FILE LIST */

app.get("/api/files", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, original_name, mime_type,
              size_bytes, created_at
       FROM files
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json({
      ok: true,
      files: result.rows
    });
  } catch (error) {
    console.error("File list error:", error.message);

    res.status(500).json({
      ok: false,
      message: "Could not load files."
    });
  }
});

/* FILE DOWNLOAD */

app.get("/api/files/:id/download", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT original_name, file_path, mime_type
       FROM files
       WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "File not found."
      });
    }

    const file = result.rows[0];
    const fullPath = path.resolve(FILE_ROOT, file.file_path);
    const rootPath = path.resolve(FILE_ROOT);

    if (
      fullPath !== rootPath &&
      !fullPath.startsWith(rootPath + path.sep)
    ) {
      return res.status(403).json({
        ok: false,
        message: "Invalid file path."
      });
    }

    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({
        ok: false,
        message: "File is missing from storage."
      });
    }

    res.download(fullPath, file.original_name, {
      headers: {
        "Content-Type": file.mime_type || "application/octet-stream"
      }
    });
  } catch (error) {
    console.error("File download error:", error.message);

    res.status(500).json({
      ok: false,
      message: "File download failed."
    });
  }
});

/* FILE DELETE */

app.delete("/api/files/:id", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT original_name, file_path
       FROM files
       WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "File not found."
      });
    }

    const file = result.rows[0];

    const fullPath = path.resolve(FILE_ROOT, file.file_path);
    const rootPath = path.resolve(FILE_ROOT);

    if (
      fullPath !== rootPath &&
      !fullPath.startsWith(rootPath + path.sep)
    ) {
      return res.status(403).json({
        ok: false,
        message: "Invalid file path."
      });
    }

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    await pool.query(
      `DELETE FROM files
       WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );

    res.json({
      ok: true,
      message: "File deleted."
    });
  } catch (error) {
    console.error("File delete error:", error.message);

    res.status(500).json({
      ok: false,
      message: "File delete failed."
    });
  }
});

app.listen(PORT, () => {
  console.log(`ECO Backend running at http://localhost:${PORT}`);
});


