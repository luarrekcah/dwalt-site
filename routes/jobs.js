const express = require("express"),
  router = express.Router(),
  { getDatabase, ref, onValue } = require("@firebase/database");

router.get("/", (req, res, next) => {
  const db = getDatabase();
  const dataWebSite = ref(db, "dataWebSite");
  onValue(dataWebSite, (snapshot) => {
    const data = {
      dbData: snapshot.val(),
      og: {
        title: "Vagas",
        desc: "Consulte agora vagas abertas para integrar à D Walt Engenharia",
        banner: "/images/ogimages/jobs.jpg",
      },
      logMessage: {
        content: null,
        type: null,
        icon: null
      },
      user: req.user
    };
    res.render("pages/jobs", data);
  });
});

router.get("/:id", (req, res, next) => {
  const db = getDatabase();
  const dataWebSite = ref(db, "dataWebSite");
  onValue(dataWebSite, (snapshot) => {
    const findById = () => {
      return snapshot.val().vagas.find((item) => item.id === req.params.id);
    };
    const data = {
      dbData: snapshot.val(),
      job: findById(),
      og: {
        title: "Serviço - " + findById().titulo,
        desc: findById().desc,
        banner: findById().img,
      },
      logMessage: {
        content: null,
        type: null,
        icon: null
      }
    };
    res.render("pages/jobs/details", data);
  });
});

module.exports = router;
