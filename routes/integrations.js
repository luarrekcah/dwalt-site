const express = require("express"),
  router = express.Router(),
  { getDatabase, ref, onValue } = require("@firebase/database");

router.get("/banco-bv", (req, res) => {
  const db = getDatabase();
  const dataWebSite = ref(db, "dataWebSite");
  onValue(dataWebSite, (snapshot) => {
    const data = {
      dbData: snapshot.val(),
      og: {
        title: "Banco BV",
        desc: "Realize sua simulação e proposta diretamente no nosso site!",
        banner: "/images/ogimages/bncBv.jpg",
      },
      logMessage: {
        content: null,
        type: null,
        icon: null,
      },
      user: req.user
    }; res.render("pages/integrations/bancobv", data);
  });
});

module.exports = router;
