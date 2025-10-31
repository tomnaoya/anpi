// ================================
// 安否確認システム server.js
// ================================
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();

// ================================
// データベース接続
// ================================
const dbPath = path.join(__dirname, "database.sqlite3");
const db = new sqlite3.Database(dbPath);

// ================================
// ミドルウェア設定
// ================================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: "anpi_secret",
  resave: false,
  saveUninitialized: true
}));

// ================================
// ログインしていないユーザーを保護
// ================================
app.use((req, res, next) => {
  const publicPaths = ["/", "/auth/login", "/auth/logout"];
  const staticExtensions = [".css", ".js", ".png", ".jpg", ".jpeg", ".gif"];

  // 静的ファイルやログイン関連ページは通す
  if (
    publicPaths.includes(req.path) ||
    staticExtensions.some(ext => req.path.endsWith(ext))
  ) {
    return next();
  }

  // セッション未保持ならログインページへリダイレクト
  if (!req.session.user) {
    return res.redirect("/");
  }

  next();
});

// ================================
// 静的ファイルの提供（ログイン保護後）
// ================================
app.use(express.static(path.join(__dirname, "public")));

// ================================
// DB初期化・テーブル作成
// ================================
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    login_id TEXT UNIQUE,
    password TEXT,
    name TEXT,
    is_admin INTEGER DEFAULT 0,
    contact_phone TEXT,
    contact_email TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    disaster TEXT,
    status TEXT,
    comment TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS disasters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // ✅ 初回起動時に管理者アカウントを自動作成
  db.get("SELECT * FROM users WHERE login_id='admin'", (err, row) => {
    if (!row) {
      db.run("INSERT INTO users (login_id, password, name, is_admin) VALUES ('admin', 'admin123', '管理者', 1)");
      console.log("✅ Default admin user created (admin / admin123)");
    }
  });
});

// ================================
// ルート定義
// ================================
const authRoutes = require("./routes/auth")(db);
const userRoutes = require("./routes/user")(db);
const adminRoutes = require("./routes/admin")(db);

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);

// ================================
// ポート設定（Render対応）
// ================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
