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
        title: "Projetos",
        desc: "Todos os projetos realizados pela empresa!",
        banner: "/images/ogimages/projects.jpg",
      },
      logMessage: {
        content: null,
        type: null,
        icon: null
      },
      user: req.user
    };
    res.render("pages/projects", data);
  });
});

router.get("/:id", (req, res, next) => {
    const db = getDatabase();
    const dataWebSite = ref(db, "dataWebSite");
    onValue(dataWebSite, (snapshot) => {
      const findById = () => {
        return snapshot.val().projects.find((item) => item.id === req.params.id);
      };
      const data = {
        dbData: snapshot.val(),
        project: findById(),
        og: {
          title: "Projeto - " + findById() === undefined ? 'Projeto' : findById().title,
          desc: findById() === undefined ? 'None' : findById().desc,
          banner: findById() === undefined ? 'None' : findById().media[0],
        },
        logMessage: {
          content: null,
          type: null,
          icon: null
        }
      };
      res.render("pages/projects/single", data);
    });
  });

module.exports = router;
