import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { __dirname } from "./__Globals.js";
import notFound from "./middlewares/notFound.js";
import compression from "compression";
import http from "http";
import paginator from "mongoose-paginate-v2";
import helmet from "helmet";
import expressSession from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import { io } from "./helpers/socket.js";
import { apiBusy, rateLimiter } from "./middlewares/rateLimit.js";
import errorHandlerMiddleware from "./middlewares/errorHandler.js";
import authMiddleware from "./base/auth.js";

// Import routes
import routes from "./routes/home.js";

dotenv.config();

paginator.paginate.options = { lean: true, leanWithId: false };
const { NODE_ENV, SESSION_SECRET, DATABASE_URL, SESSION_DB_NAME, SESSION_DB_COLLECTION } = process.env;

const app = express();

app.use(compression());
app.set("trust proxy", 1);
app.use(express.json({ limit: "3MB" }));
app.use(express.urlencoded({ extended: false }));

app.use(notFound);

const server = http.createServer(app);

const getOrigin = (origin, callback) => {
  const allowedOrigin = !origin || ["localhost", "database-app-nine.vercel.app"].some((value) => origin.includes(value));
  if (allowedOrigin) {
    callback(null, true);
  } else {
    callback(new Error("Not allowed by CORS"));
  }
};

const corsOptions = {
  credentials: true,
  origin: getOrigin
};

const options = {
  mongoUrl: DATABASE_URL,
  dbName: SESSION_DB_NAME,
  collectionName: SESSION_DB_COLLECTION,
  ttl: 20000,
  crypto: {
    secret: "squirrel"
  }
};

app.use(cors(corsOptions));
app.use(morgan("tiny"));
app.use(helmet());

app.use(
  expressSession({
    name: "phonebook",
    secret: SESSION_SECRET,
    saveUninitialized: false,
    resave: true,
    store: MongoStore.create(options),
    cookie: {
      sameSite: NODE_ENV === "development" ? "lax" : "none",
      secure: NODE_ENV !== "development",
      httpOnly: true,
      maxAge: 6 * 60 * 60 * 1000 // 12 hours,
    }
  })
);

global.__basedir = __dirname;

app.use(passport.authenticate("session"));

// Routes
app.use(`/api/`, authMiddleware, routes);

// Use middlewares
app.use(notFound);
app.use(errorHandlerMiddleware);
app.use(rateLimiter);
app.use(apiBusy);

app.use(cors(corsOptions));

app.use("/api", routes);

io.attach(server, {
    cors: {
      origin: getOrigin,
      methods: ["GET", "POST"],
      credentials: true
    }
});
  
export default server;