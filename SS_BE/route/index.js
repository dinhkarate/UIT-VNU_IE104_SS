// import router
const site = require("./site.router")
const product = require("./products.router")
const auth = require("./auth.router")
const account = require("./account.router")
const news = require("./news.router")

const route = (app) => {
  app.use(middlewares.authenticate);

  app.use("/", homepage)

  app.use("/court", court)

  app.use('/account', account)


}


module.exports = route;