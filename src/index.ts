import bodyParser from "body-parser";
import express from "express";

import loggingMiddleware from "./middleware/logging";
import MessageController from "./controllers/message";

const port = 8080;
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(loggingMiddleware);

// Controllers
app.get("/health", (req, res) => res.json({ status: "OK" }));
app.use("/v1/messages", new MessageController().router);

// Start server
app.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});
