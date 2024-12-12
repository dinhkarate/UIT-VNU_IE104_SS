// import router
const court = require("./courtRouter")
const site = require("./siteRouter")
const auth = require("./authRouter")

const route = (app) => {
  app.use("/api", site);
  
  app.use("/api/court", court);

  app.use("/api/auth", auth);
}

module.exports = route;