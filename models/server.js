const express = require("express");
const cors = require("cors");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const { dbConnection } = require("../database/config.db");

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
    this.swaggerOptions = {
      swaggerDefinition: {
        openapi: "3.0.1",
        info: {
          title: "Health API",
          version: "1.0.0",
          description: "Health API Information",
          contact: {
            name: "SA",
          },
          servers: [
            {
              url: "https://salud-server.vercel.app/",
              description: "Development server",
            },
          ],
        },
      },

      apis: ["routes/*.js", "models/*.js"],
    };
    this.swaggerDocs = swaggerJSDoc(this.swaggerOptions);
    this.CSS_URL =
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

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
    //PARSE AND READ OF BODY
    this.app.use(express.json());
    //public folder
    this.app.use(express.static("public"));
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
    // swaggerSetup(this.app, this.port);
    this.app.use(
      "/api/docs",
      swaggerUi.serve,
      swaggerUi.setup(this.swaggerDocs, {
        explorer: true,
        customCssUrl: this.CSS_URL,
      })
    );
    this.app.get("/api/docs.json", (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.send(this.swaggerDocs);
    });
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Server on:", this.port);
    });
  }
}

module.exports = Server;
