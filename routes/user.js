const express = require("express");
const router = express.Router();
// const axios = require('/app/node_modules/axios');
// const axios = require("axios");


const AuthController = require('../controllers/AuthController');


router.post("/register", async (req, res) => {
  res.redirect("/");
});

router.post("/login", async (req, res) => {

  await AuthController.login(req, res).then(data => {
    req.session.token = data.token;
    res.redirect("/");
  }).catch(() => {
    req.flash("error", "Invalid email or password");
    res.redirect(req.headers.referer);
  });
});

router.get("/logout", (req, res) => {
  delete req.session.token;
  res.redirect("/");
});

module.exports = router;
