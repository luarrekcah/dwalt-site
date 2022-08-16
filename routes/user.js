const express = require("express"),
  router = express.Router(),
  { getDatabase, ref, onValue } = require("@firebase/database");

const passportGoogle = require("../auth/google");

router.get("/login", (req, res) => {
  const db = getDatabase();
  const dataWebSite = ref(db, "dataWebSite");
  onValue(dataWebSite, (snapshot) => {
    const data = {
      dbData: snapshot.val(),
      og: {
        title: "Login",
        desc: "Faça o login para acessar a página integrador",
        banner: "",
      },
      logMessage: {
        content: null,
        type: null,
        icon: null,
      }
    }; res.render("pages/user/login", data);
  });
});


router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get(
  "/google",
  passportGoogle.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/plus.login"],
  })
);

router.get(
  "/google/callback",
  passportGoogle.authenticate("google", { failureRedirect: "/usuario/login" }),
  (req, res) => {
    res.redirect("/");
  }
);


module.exports = router;
