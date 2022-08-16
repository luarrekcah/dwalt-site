const express = require("express"),
  router = express.Router(),
  { getDatabase, ref, onValue } = require("@firebase/database")

let logMessage = {
  content: null,
  type: null,
  icon: null,
};

router.get("/", (req, res) => {
  const db = getDatabase();
  const dataWebSite = ref(db, "dataWebSite");
  onValue(dataWebSite, (snapshot) => {
    const data = {
      dbData: snapshot.val(),
      posts: snapshot.val().blogPosts,
      og: {
        title: "Staffs",
        desc: "Conheça nossa super equipe, a qual trabalha 24h para melhor lhe atender e entregar projetos impecáveis.",
        banner: "/images/ogimages/staffs.jpg",
      },
      logMessage,
      user: req.user
    }; res.render("pages/staffs", data);
  });
});

router.get("/:id", (req, res, next) => {
  const db = getDatabase();
  const dataWebSite = ref(db, "dataWebSite");
  onValue(dataWebSite, (snapshot) => {
    const findById = () => {
      return snapshot.val().blogPosts.find((item) => item.id === req.params.id);
    };
    const data = {
      dbData: snapshot.val(),
      post: findById(),
      og: {
        title: findById().title,
        desc: findById().desc,
        banner: findById().media.src,
      },
      logMessage
    };
    res.render("pages/staffs/details", data);
  });
});

module.exports = router;
