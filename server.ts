import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("society.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    role TEXT DEFAULT 'member',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS committee (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    designation TEXT NOT NULL,
    image_url TEXT,
    order_index INTEGER DEFAULT 0
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/news", (req, res) => {
    const news = db.prepare("SELECT * FROM news ORDER BY date DESC").all();
    res.json(news);
  });

  app.get("/api/committee", (req, res) => {
    const committee = db.prepare("SELECT * FROM committee ORDER BY order_index ASC").all();
    res.json(committee);
  });

  app.post("/api/register", (req, res) => {
    const { name, email, password, phone } = req.body;
    try {
      const stmt = db.prepare("INSERT INTO members (name, email, password, phone) VALUES (?, ?, ?, ?)");
      const info = stmt.run(name, email, password, phone);
      res.json({ success: true, id: info.lastInsertRowid });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    const member = db.prepare("SELECT * FROM members WHERE email = ? AND password = ?").get(email, password);
    if (member) {
      res.json({ success: true, member });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Seed initial data if empty
const committeeCount = db.prepare("SELECT COUNT(*) as count FROM committee").get() as { count: number };
if (committeeCount.count === 0) {
  const stmt = db.prepare("INSERT INTO committee (name, designation, image_url, order_index) VALUES (?, ?, ?, ?)");
  stmt.run("জনাব মোঃ আব্দুল হাই", "সভাপতি", "https://picsum.photos/seed/p1/300/300", 1);
  stmt.run("জনাব মোঃ রহমত উল্লাহ", "সাধারণ সম্পাদক", "https://picsum.photos/seed/p2/300/300", 2);
  stmt.run("জনাব মোঃ শাহজাহান", "কোষাধ্যক্ষ", "https://picsum.photos/seed/p3/300/300", 3);
}

const newsCount = db.prepare("SELECT COUNT(*) as count FROM news").get() as { count: number };
if (newsCount.count === 0) {
  const stmt = db.prepare("INSERT INTO news (title, content, image_url) VALUES (?, ?, ?)");
  stmt.run("বার্ষিক সাধারণ সভা ২০২৪", "আগামী ১০ই মার্চ আমাদের বার্ষিক সাধারণ সভা অনুষ্ঠিত হবে। সকল সদস্যকে উপস্থিত থাকার জন্য অনুরোধ করা হলো।", "https://picsum.photos/seed/news1/800/400");
  stmt.run("শীতবস্ত্র বিতরণ কর্মসূচি", "বিষ্ণুপুর ইউনিয়নের দুস্থ পরিবারের মাঝে শীতবস্ত্র বিতরণ করা হয়েছে।", "https://picsum.photos/seed/news2/800/400");
}

startServer();
