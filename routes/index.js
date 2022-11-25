const { getReviews } = require("../services/google");

const express = require("express"),
  router = express.Router(),
  { getDatabase, ref, onValue } = require("@firebase/database"),
  fs = require("fs"),
  xml = fs.readFileSync(__dirname + '/../sitemap.xml');

router.get("/", (req, res) => {
  const db = getDatabase();
  const dataWebSite = ref(db, "dataWebSite");
  onValue(dataWebSite, async (snapshot) => {
    const reviews = await getReviews();
    const user = req.user;
    const data = {
      dbData: snapshot.val(),
      og: {
        title: "Página Principal",
        desc: "Somos a D | Walt Engenharia, empresa especializada em Energia Solar, entre no nosso site para nos conhecer melhor!",
        banner: "/images/ogimages/index.jpg",
      },
      logMessage: {
        content: null,
        type: null,
        icon: null,
      },
      user: req.user
    };
    if(user) {
      data.logMessage = {
        content: `Seja bem vindo${" "+user.documents.name.split(" ")[0]}!`,
        type: "info",
        icon: null,
      }
    }
    res.render("pages/index", data);
  });
});

router.get("/venda", function (req, res, next) {
  res.render("pages/landing");
});


router.get("/sitemap.xml", function (req, res, next) {
  res.set("Content-Type", "text/xml");
  res.send(xml);
});

router.get("/mediakit.rar", function (req, res, next) {
  res.send(fs.readFileSync(__dirname + '/../public/mediaKit.rar'));
});

router.get("/politica", function (req, res, next) {
  const db = getDatabase();
  const dataWebSite = ref(db, "dataWebSite");
  onValue(dataWebSite, (snapshot) => {
    const data = {
      dbData: snapshot.val(),
      og: {
        title: "Política de Privacidade",
        desc: "Documento legal com informações de como operamos e transferimos dados como parte dos nossos serviços.",
        banner: "/images/ogimages/pop.jpg",
      },
      logMessage: {
        content: "Em caso de dúvidas, entre em contato",
        type: "info",
        icon: null,
      },
      user: req.user
    };
    res.render("pages/legalConditions/politica", data);
  })
});

router.get("/termos", function (req, res, next) {
  const db = getDatabase();
  const dataWebSite = ref(db, "dataWebSite");
  onValue(dataWebSite, (snapshot) => {
    const data = {
      dbData: snapshot.val(),
      og: {
        title: "Termos de Uso",
        desc: "Documento legal com informações de como operamos e transferimos dados como parte dos nossos serviços.",
        banner: "/images/ogimages/tos.jpg",
      },
      logMessage: {
        content: "Em caso de dúvidas, entre em contato",
        type: "info",
        icon: null,
      },
      user: req.user
    };
    res.render("pages/legalConditions/termos", data);
  });
});


router.get("/faq", function (req, res, next) {
  const db = getDatabase();
  const dataWebSite = ref(db, "dataWebSite");
  onValue(dataWebSite, (snapshot) => {
    const data = {
      dbData: snapshot.val(),
      og: {
        title: "FAQ",
        desc: "Perguntas frequentes que recebemos de nossos clientes",
        banner: "/images/ogimages/faq.jpg",
      },
      logMessage: {
        content: "Entre em contato",
        type: "info",
        icon: null,
      },
      user: req.user
    };
    res.render("pages/faq", data);
  });
});


router.get("/contato", function (req, res, next) {
  const db = getDatabase();
  const dataWebSite = ref(db, "dataWebSite");
  onValue(dataWebSite, (snapshot) => {
    const data = {
      dbData: snapshot.val(),
      og: {
        title: "Contato",
        desc: "Localização e métodos de contato",
        banner: "/images/ogimages/contact.jpg",
      },
      logMessage: {
        content: null,
        type: "info",
        icon: null,
      },
      user: req.user
    };
    res.render("pages/contact", data);
  });
});

module.exports = router;
