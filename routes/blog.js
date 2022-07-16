const express = require("express"),
  router = express.Router(),
  { getDatabase, ref, onValue } = require("@firebase/database")

router.get("/", (req, res) => {
  const db = getDatabase();
  const dataWebSite = ref(db, "dataWebSite");
  onValue(dataWebSite, (snapshot) => {
    const data = {
      dbData: snapshot.val(),
      posts: snapshot.val().blogPosts,
      og: {
        title: "Blog",
        desc: "Notícias e novidades da empresa em primeira mão!",
        banner: "/images/ogimages/blog.jpg",
      },
      logMessage: {
        content: "Se inscreva e seja notificado em novos posts",
        type: "info",
        icon: null,
      }
    }; res.render("pages/blog", data);
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
      logMessage: {
        content: null,
        type: null,
        icon: null,
      }
    };
      res.render("pages/blog/details", data);
  });
});

module.exports = router;
