import http from "http";
import morgan from "morgan";
import express from "express";
import bodyparser from "body-parser";
import path from "path";
import swaggerUI from "swagger-ui-express";
import user from "./v1/routes/user";
import loan from "./v1/routes/loan";
import admin from "./v1/routes/admin";
import docs from "../swagger.json";

const app = express();

app.use(morgan("dev"));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

// API routes
app.use(express.static(path.join("UI")));
app.use("/api/v1/auth", user);
app.use("/api/v1", loan);
app.use("/api/v1", admin);

// Home page route
app.get("/", (req, res) => {
  res.status(200).json({
    status: 200,
    data: [
      {
        message: "Welcome to Fast Credit Home Route",
      },
    ],
  });
});

// Render quick credit documentation
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(docs));

// handle all error
app.use((err, req, res, next) => {
  if (err) {
    return res.status(500).json({
      status: 500,
      error: "Internal server error",
    });
  }
  return next();
});

// Handle non exist route with with proper message
app.use((req, res) => {
  res.status(404).json({
    status: 404,
    error: "Wrong request. Route does not exist",
  });
});

const server = http.createServer(app);
const port = process.env.PORT || 5500;

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`listening to server on 127.0.0.1:${port}`);
});

module.exports = app;
