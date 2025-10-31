const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // 緊急連絡先の登録
  router.post("/update-contact", (req, res) => {
    const user = req.session.user;
    const { contact_phone, contact_email } = req.body;
    db.run(
      "UPDATE users SET contact_phone=?, contact_email=? WHERE id=?",
      [contact_phone, contact_email, user.id],
      (err) => res.redirect("/dashboard.html")
    );
  });

  // 安否報告登録
  router.post("/report", (req, res) => {
    const user = req.session.user;
    const { disaster, status, comment } = req.body;
    db.run(
      "INSERT INTO reports (user_id, disaster, status, comment) VALUES (?, ?, ?, ?)",
      [user.id, disaster, status, comment],
      (err) => res.redirect("/dashboard.html")
    );
  });

  return router;
};
