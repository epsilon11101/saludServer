const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

//*METADATA info about our API

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Health API",
      description: "Health API Information",
      contact: {
        name: "SA",
      },
      servers: ["https://salud-server.vercel.app/"],
    },
  },

  apis: ["routes/*.js", "models/*.js"],
};
//*Swagger Docs
const swaggerDocs = swaggerJSDoc(swaggerOptions);

// * Function to setup swagger
const swaggerSetup = (app, port) => {
  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs, { customCssUrl: CSS_URL })
  );

  app.get("/api/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerDocs);
  });
  // console.log("V1 Swagger Setup");
};

module.exports = swaggerSetup;
