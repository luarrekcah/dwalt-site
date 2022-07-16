const indexRouter = require("./routes/index"),
  projectsRouter = require("./routes/projects"),
  productsRouter = require("./routes/store"),
  servicesRouter = require("./routes/services"),
  blogRouter = require("./routes/blog"),
  integrationsRouter = require("./routes/integrations"),
  jobsRouter = require("./routes/jobs"),
  searchRouter = require("./routes/search"),
  staffsRouter = require("./routes/staffs"),
  notFoundRouter = require("./routes/404");

require('./listener');

module.exports = (app) => {
  app.use("/", indexRouter);
  app.use("/projetos", projectsRouter);
  app.use("/produtos", productsRouter);
  app.use("/servicos", servicesRouter);
  app.use("/blog", blogRouter);
  app.use("/integracoes", integrationsRouter);
  app.use("/vagas", jobsRouter);
  app.use("/pesquisa", searchRouter);
  app.use("/staffs", staffsRouter);

  app.use("*", notFoundRouter);
} 