// import router
const court = require("./courtRouter")
const site = require("./siteRouter")
const auth = require("./authRouter")
const account = require("./accountRouter")
const middleware = require("../middleware")

const route = (app) => {
  app.use(middleware.authorize);

  app.use("/api", site);
  
  app.use("/api/court", court);

  app.use("/api/auth", auth);

  app.use("/api/account", account);
}

module.exports = route;