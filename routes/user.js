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

    switch (req.query.message) {
      case 'credentials':
        data.logMessage.content = "Usuário ou senha inválidos"
        data.logMessage.type = 'error';
        break;
      case 'unknown':
        data.logMessage.content = "Erro Desconhecido"
        data.logMessage.type = 'error';
        break;
      case 'passwordsdontmatch':
        data.logMessage.content = "As senhas não coincidem"
        data.logMessage.type = 'error';
        break;
      case 'userexists':
        data.logMessage.content = "Esse usuário já existe"
        data.logMessage.type = 'error';
        break;
      case 'errorrecaptcha':
        data.logMessage.content = "Verifique o Captcha!"
        data.logMessage.type = 'error';
        break;
      case 'registered':
        data.logMessage.content = "Usuário registrado, faça login!"
        data.logMessage.type = 'success';
        break;
    }

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
    switch (req.query.message) {
      case 'userupdated':
        data.logMessage.content = "Usuário Atualizado!"
        data.logMessage.type = 'success';
        break;
      case 'cregistrado':
        data.logMessage.content = "Cliente cadastrado"
        data.logMessage.type = 'success';
        break;
    }
    res.render("pages/user/myaccount", data);
  });
});


router.post("/conta", (req, res) => {
  console.log(req.body);
  switch (req.body.type) {
    case 'comprgstr':
      const db = getDatabase();
      const users = ref(db, "users");
      onValue(users, (snapshot) => {
        let allUsers = snapshot.val();
        const newUsers = allUsers.map((item) => {
          if (item._id === req.body.id) {
            item.documents.name = req.body.name
            item.documents.cpfOrCnpj = req.body.cpf
            item.contact.number = req.body.celular
          }
          return item;
        });
        console.log(newUsers);
        set(ref(db, "users"), newUsers).then(() => {
          res.redirect("conta?message=userupdated")
        })
      }, {
        onlyOnce: true
      });
      break;
  }
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

router.get(
  "/google",
  passportGoogle.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/plus.login", "https://www.googleapis.com/auth/userinfo.email"],
  })
);

router.get(
  "/google/callback",
  passportGoogle.authenticate("google", { failureRedirect: "/usuario/login?fail=true&message=unknown" }),
  (req, res) => {
    res.redirect("/");
  }
);

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "login?fail=true&message=credentials",
  })
);

router.post("/registrar", (req, res) => {
  const data = req.body;
  console.log(data);
  if (data.password !== data.confPass) return res.redirect('login?fail=true&message=passwordsdontmatch');
  if (data['g-recaptcha-response'] === '') return res.redirect('login?fail=true&message=errorrecaptcha');
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
      verified: false,
      documents: {
        name: "",
        cpfOrCnpj: "",
      },
      contact: {
        number: ""
      },
      contractURL: ""
    };

    const checkUnique = () => {
      return allUsers.find((item) => item.email === user.email);
    };

    if (checkUnique())
      return res.redirect('login?fail=true&message=userexists');

    allUsers.push(user);
    set(ref(db, "users"), allUsers);

    return res.redirect("login?message=registered");
  }, {
    onlyOnce: true
  });
});

router.get("/registrarcliente", (req, res, next) => {
  authenticationMiddleware(req, res, next);
  const db = getDatabase();
  const dataWebSite = ref(db, "dataWebSite");
  onValue(dataWebSite, (snapshot) => {
    const data = {
      dbData: snapshot.val(),
      og: {
        title: "Registro de cliente",
        desc: "Faça login para registrar",
        banner: "",
      },
      logMessage: {
        content: null,
        type: null,
        icon: null,
      },
      user: req.user
    };
    switch (req.query.message) {
      case 'customeradded':
        data.logMessage.content = "Usuário Adicionado!"
        data.logMessage.type = 'success';
        break;
    }
    res.render("pages/user/registercustomer", data);
  });
});

router.post("/registrarcliente", (req, res, next) => {
  const customer = req.body;
  const db = getDatabase();
  const users = ref(db, "users");
  onValue(users, async (snapshot) => {
    let userUpdate = snapshot.val().map(u => {
      if (u._id === req.user._id) {
        let cArray = [];
        if (u.customers !== undefined) {
          cArray = u.customers
        }
        cArray.push(customer);
        u.customers = cArray;
      }
      return u;
    });
    console.log(userUpdate); // nn ta atualizando na DB e nem fazendo redirect
    set(ref(db, "users"), userUpdate);
    return res.redirect("/usuario/conta?message=cregistrado");
  });
});


module.exports = router;
