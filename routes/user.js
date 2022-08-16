const express = require("express"),
  router = express.Router(),
  { getDatabase, ref, onValue } = require("@firebase/database"),
  bcrypt = require("bcryptjs"),
  passport = require("passport");

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
      },
      user: req.user
    };

    if (req.query.fail)
      data.message = "Usuário ou senha inválidos"

    res.render("pages/user/login", data);
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

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "login?fail=true",
  })
);

router.post("/registrar", (req, res) => {
  const data = req.body;
  console.log(data);
  if (data.senha !== data.confSenha) return res.redirect('login?fail=true&error=passwordsdontmatch');

  res.redirect("/");
  /*const db = getDatabase();
  const users = ref(db, "users");
  onValue(users, (snapshot) => {
    let allUsers = snapshot.val();
    if (allUsers == null) {
      allUsers = [];
    }
    const user = {
      _id: req.body.username,
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    };
    const checkUnique = () => {
      return allUsers.find((item) => item.username === user.username);
    };
    if (allUsers == undefined) {
    } else {
      if (checkUnique())
        return res.send(
          "usuário existente/registrado, volte para a tela de login para entrar"
        );
    }
    //fix this
    allUsers.push(user);
    set(ref(db, "users"), allUsers).then(() => {
      console.log("registrado");
    });
  });*/
});


module.exports = router;
