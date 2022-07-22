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

    snapshot.val().products.forEach((item, i) => {
      if (snapshot.val().products[i].resumedtitle.toLowerCase().includes(req.query.q.toLowerCase()) ) {
         results.push({title: snapshot.val().products[i].resumedtitle, href: `/produtos/${snapshot.val().products[i].code}`});
      }
    });

    snapshot.val().blogPosts.forEach((item, i) => {
      if (snapshot.val().blogPosts[i].title.toLowerCase().includes(req.query.q.toLowerCase()) ) {
         results.push({title: snapshot.val().blogPosts[i].title, href: `/blog/${snapshot.val().blogPosts[i].id}`});
      }
    });

    snapshot.val().projects.forEach((item, i) => {
      if (snapshot.val().projects[i].title.toLowerCase().includes(req.query.q.toLowerCase()) ) {
         results.push({title: snapshot.val().projects[i].title, href: `/projetos/${snapshot.val().projects[i].id}`});
      }
    });
 
    snapshot.val().services.forEach((item, i) => {
      if (snapshot.val().services[i].title.toLowerCase().includes(req.query.q.toLowerCase()) ) {
         results.push({title: snapshot.val().services[i].title, href: `/servicos/${snapshot.val().services[i].id}`});
      }
    });

    snapshot.val().vagas.forEach((item, i) => {
      if (snapshot.val().vagas[i].titulo.toLowerCase().includes(req.query.q.toLowerCase()) ) {
         results.push({title: snapshot.val().vagas[i].titulo, href: `/vagas/${snapshot.val().vagas[i].id}`});
      }
    });
 
    const data = {
      dbData: snapshot.val(),
      og: {
        title: "Pesquisa - " + req.query.q,
        desc: "Resultado da pesquisa " + req.query.q,
        banner: "/images/ogimages/services.jpg",
      },
      logMessage,
      results
    };
    res.render("pages/search", data);
  });
});

module.exports = router;
