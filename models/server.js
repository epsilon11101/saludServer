const express = require("express");
const cors = require("cors");
// const morgan = require("morgan");
// const fs = require("fs");
// const path = require("path");
const { dbConnection } = require("../database/config.db");
const swaggerSetup = require("../v1/swagger");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.paths = {
      auth: "/api/auth",
      products: "/api/health-products",
      daily: "/api/daily",
      search: "/api/search",
      day: "/api/day",
    };

    // this.accessLogStream = fs.createWriteStream(
    //   path.join(__dirname, "../logs/access.log"),
    //   { flags: "a" }
    // );

    //connect to DB
    this.connectDB();
    //Middlewares
    this.middlewares();
    //app routes
    this.routes();
  }

  async connectDB() {
    await dbConnection();
  }

  middlewares() {
    //CORS
    this.app.use(cors());
    //MORGAN
    // this.app.use(morgan("combined", { stream: this.accessLogStream }));
    //PARSE AND READ OF BODY
    this.app.use(express.json());
    //public folder
    // this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.paths.auth, require("../routes/auth.routes"));
    this.app.use(this.paths.daily, require("../routes/daily.routes"));
    this.app.use(
      this.paths.products,
      require("../routes/health-products.routes")
    );
    this.app.use(this.paths.search, require("../routes/search.routes"));
    this.app.use(this.paths.day, require("../routes/day.routes"));
  }

  listen() {
    this.app.listen(this.port, () => {
      swaggerSetup(this.app, this.port);
      console.log("Server on:", this.port);
    });
  }
}

module.exports = Server;
