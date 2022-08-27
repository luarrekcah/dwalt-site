const express = require("express"),
  router = express.Router(),
  { getDatabase, ref, onValue, set } = require("@firebase/database"),
  bcrypt = require("bcryptjs"),
  passport = require("passport");

const passportGoogle = require("../auth/google");

const { authenticationMiddleware } = require("./JS/middlewares")

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
    else data.message = null

    res.render("pages/user/login", data);
  }, {
    onlyOnce: true
  });
});

router.get("/conta", (req, res, next) => {
  authenticationMiddleware(req, res, next);
  const db = getDatabase();
  const dataWebSite = ref(db, "dataWebSite");
  onValue(dataWebSite, (snapshot) => {
    const data = {
      dbData: snapshot.val(),
      og: {
        title: "Minha Conta",
        desc: "Dashboard integrador",
        banner: "",
      },
      logMessage: {
        content: null,
        type: null,
        icon: null,
      },
      user: req.user
    };

    res.render("pages/user/myaccount", data);
  }, {
    onlyOnce: true
  });
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/');
  });
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
  if (data.password !== data.confPass) return res.redirect('login?fail=true&error=passwordsdontmatch');
  const db = getDatabase();
  const users = ref(db, "users");
  onValue(users, async (snapshot) => {
    let allUsers;

    if (snapshot.val() === null) {
      allUsers = [];
    } else {
      allUsers = snapshot.val();
    };

    const user = {
      _id: data.email,
      email: data.email,
      password: bcrypt.hashSync(data.password),
    };

    const checkUnique = () => {
      return allUsers.find((item) => item.email === user.email);
    };

    if (checkUnique())
      return res.redirect('login?fail=true&error=userexists');

    allUsers.push(user);
    set(ref(db, "users"), allUsers);

    /*
    Add user to database, and redirect the same to login
    page and show the message: "User Registered, enter your login to continue".
    */
    return res.redirect("/login");
  }, {
    onlyOnce: true
  });
});


module.exports = router;
