const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // 全員の連絡先確認
  router.get("/contacts", (req, res) => {
    db.all("SELECT name, contact_phone, contact_email FROM users", (err, rows) => {
      res.json(rows);
    });
  });

  // 災害情報登録
  router.post("/disaster", (req, res) => {
    const { title, description } = req.body;
    db.run("INSERT INTO disasters (title, description) VALUES (?, ?)", [title, description], (err) =>
      res.redirect("/dashboard.html")
    );
  });

  // 災害一覧
  router.get("/disasters", (req, res) => {
    db.all("SELECT * FROM disasters ORDER BY created_at DESC", (err, rows) => res.json(rows));
  });

  return router;
};
