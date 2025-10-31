const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.post("/login", (req, res) => {
    const { login_id, password } = req.body;
    db.get("SELECT * FROM users WHERE login_id=? AND password=?", [login_id, password], (err, user) => {
      if (user) {
        req.session.user = user;
        res.redirect("/dashboard.html");
      } else {
        res.send("ログインIDまたはパスワードが違います。");
      }
    });
  });

  router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
  });

  return router;
};
