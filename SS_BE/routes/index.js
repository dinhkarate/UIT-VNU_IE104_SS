// import router
const court = require("./courtRouter")
const site = require("./siteRouter")

const route = (app) => {
  app.use("/api", site);
  
  app.use("/api/court", court)
}

module.exports = route;