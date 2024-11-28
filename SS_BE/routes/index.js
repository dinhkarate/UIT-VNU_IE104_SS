// import router
const court = require("./courtRouter")

const route = (app) => {
  app.use("/api/court", court)
}

module.exports = route;