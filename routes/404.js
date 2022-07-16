const express = require("express"),
  router = express.Router(),
  { getDatabase, ref, onValue } = require("@firebase/database");

router.get("/", (req, res) => {
  const db = getDatabase();
  const dataWebSite = ref(db, "dataWebSite");
  onValue(dataWebSite, (snapshot) => {
    const data = {
      dbData: snapshot.val(),
      og: {
        title: "Página não encontrada",
        desc: "Não foi possível encontrar essa página.",
        banner: "/images/ogimages/404.jpg",
      },
      logMessage: {
        content: "Página não encontrada, verifique o link!",
        type: "error",
        icon: null,
      }
    }; res.render("404", data);
  });
});

module.exports = router;
