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
        title: "Serviços",
        desc: "Nossas especializações e informações sobre execução.",
        banner: "/images/ogimages/services.jpg",
      },
      logMessage: {
        content: null,
        type: null,
        icon: null
      }
    };
    res.render("pages/services", data);
  });
});

router.get("/:id", (req, res, next) => {
    const db = getDatabase();
    const dataWebSite = ref(db, "dataWebSite");
    onValue(dataWebSite, (snapshot) => {
      const findById = () => {
        return snapshot.val().services.find((item) => item.id === req.params.id);
      };
      const data = {
        dbData: snapshot.val(),
        service: findById(),
        og: {
          title: "Serviço - " + findById().title,
          desc: findById().desc,
          banner: findById().bannerSrc,
        },
        logMessage: {
        content: null,
        type: null,
        icon: null
      }
      };
      res.render("pages/services/details", data);
    });
  });

module.exports = router;
