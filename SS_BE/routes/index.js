// import middlewares
const middlewares = require("../middlewares");

// import router
const homepage = require("./homepageRouter")
const court = require("./courtRouter")
const account = require("./account.router")

const route = (app) => {
  app.use(middlewares.authenticate);

  app.use("/", homepage)

  app.use("/court", court)

  app.use('/account', middlewares.authenticate, account)

}

// app.get("/products", controllers.product.queryProduct);
// app.post("/login", controllers.auth.loginPost);


module.exports = route;