// import DB connection
import connectDB from "./app/db/connect.js";
import express from "express";
import dotenv from "dotenv";
dotenv.config('.');

import morgan from "morgan";
import cors from "cors";
import { __dirname } from "./__Globals.js";
import notFound from "./app/middlewares/notFound.js";

//import routes
import homeRoutes from './app/routes/home.js'
import contactRoutes from './app/routes/Contact.js'

const app = express();

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
const apiPath = "/api";
app.use(apiPath + "/", homeRoutes);
app.use(apiPath + "/contact", contactRoutes);

global.__basedir = __dirname + '/app/assets/'


app.use(notFound);
/**
 * HANDLING UNCAUGHT EXCEPTION ERRORS
 * Process.traceDeprecation = true;
 */
process.on("uncaughtException", (err) => {
  console.log(
    `UNCAUGHT EXCEPTION! Server Shutting down...\n
      ${err.name} \n ${err.message} \n ${err.stack}`
  );
  process.exit(1);
});

let HOSTNAME = process.env.HOST || '';
const PORT = process.env.PORT;
const MONGO_URI =
  process.env.NODE_ENV !== "production"
    ? process.env.DEV_DB_URL
    : process.env.PROD_DB_URL;

// Create and start server
const server_start = async () => {
  try {
    await connectDB(MONGO_URI).then(() => {
      console.log("DB successfully connected.");
    });

    app.listen(PORT, () =>
      console.log(`Server is listening on port ${PORT}...`)
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

server_start();