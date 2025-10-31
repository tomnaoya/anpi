const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const dbPath = path.join(__dirname, "database.sqlite3");
const db = new sqlite3.Database(dbPath);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({ secret: "anpi_secret", resave: false, saveUninitialized: true }));

// DB初期化＋管理者自動登録
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
  db.get("SELECT * FROM users WHERE login_id='admin'", (err, row) => {
    if (!row) {
      db.run("INSERT INTO users (login_id, password, name, is_admin) VALUES ('admin', 'admin123', '管理者', 1)");
      console.log("✅ Default admin user created (admin / admin123)");
    }
  });
});

const authRoutes = require("./routes/authRoute")(db);
const userRoutes = require("./routes/userRoute")(db);
const adminRoutes = require("./routes/adminRoute")(db);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);

// ✅ Render対応ポート
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
