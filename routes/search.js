const express = require("express"),
  router = express.Router(),
  { getDatabase, ref, onValue } = require("@firebase/database");

let logMessage = {
  content: null,
  type: null,
  icon: null
};

router.get("/", (req, res, next) => {
  const db = getDatabase();
  const dataWebSite = ref(db, "dataWebSite");
  onValue(dataWebSite, (snapshot) => {
    let results = [];

    const db = snapshot.val();

    if (db.products) {
      db.products.forEach((item, i) => {
        if (item.resumedtitle.toLowerCase().includes(req.query.q.toLowerCase())) {
          results.push({ title: item.resumedtitle, href: `/produtos/${item.code}` });
        }
      });
    }

    if (db.blogPosts) {
      db.blogPosts.forEach((item, i) => {
        if (item.title.toLowerCase().includes(req.query.q.toLowerCase())) {
          results.push({ title: item.title, href: `/blog/${item.id}` });
        }
      });
    }

    if (db.projects) {
      db.projects.forEach((item, i) => {
        if (item.title.toLowerCase().includes(req.query.q.toLowerCase())) {
          results.push({ title: item.title, href: `/projetos/${item.id}` });
        }
      });
    }

    if (db.services) {
      db.services.forEach((item, i) => {
        if (item.title.toLowerCase().includes(req.query.q.toLowerCase())) {
          results.push({ title: item.title, href: `/servicos/${item.id}` });
        }
      });
    }

    if (db.vagas) {
      db.vagas.forEach((item, i) => {
        if (item.titulo.toLowerCase().includes(req.query.q.toLowerCase())) {
          results.push({ title: item.titulo, href: `/vagas/${item.id}` });
        }
      });
    }

    const data = {
      dbData: db,
      og: {
        title: "Pesquisa - " + req.query.q,
        desc: "Resultado da pesquisa " + req.query.q,
        banner: "/images/ogimages/services.jpg",
      },
      logMessage,
      results,
      user: req.user
    };
    res.render("pages/search", data);
  });
});

module.exports = router;
