import passport from "passport";
import LocalStrategy from "passport-local"
import User from "../models/User.js";
import { comparePassword, generateHashString, removePropertiesFromObject } from "../utils/index.js";
import asyncWrapper from "../middlewares/async.js";
import { error, success } from "../helpers/response.js";
import BadRequest from "../utils/errors/badRequest.js";

passport.use(
    new LocalStrategy({ usernameField: "username" }, async (username, password, done) => {
      try {
        const user = await User.findOne({ username }).lean();
        
        if (!user) return done({ message: "User does not exist" });

        const isPasswordCorrect = await comparePassword(password, user.password);
  
        if (!isPasswordCorrect) return done({ message: "Invalid Credentials" });
  
        let loggedInUser = await User.findByIdAndUpdate({ _id: user._id }, { $set: { lastLogin: new Date() } }).lean();
  
        loggedInUser = removePropertiesFromObject(loggedInUser, ["password"]);
  
        return done(null, loggedInUser);
      } catch (e) {
        return done(e);
      }
    })
);
  
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (userId, done) => {
    const user = await User.findById(userId, "-password").lean();
    return done(null, user);
});

/**
   * * signIn - Login user
   * @async
   * @param req
   * @param res
   */

export const signIn = (req, res) => success(res, 200, req.user);

export const signUp = asyncWrapper(async (req, res) => {
    try {
        const { body: { username, password }, file } = req

        let user = await User.findOne({ username }).lean()

        if (user) throw BadRequest('User already exist')

        const hashed = generateHashString(password)

        let query = {
            ...req.body,
            password: hashed
        }

        if (file?.path) {
            query = {
                ...query,
                avatar: file?.path
            }
        }

        user = await new User({ ...query }).save()

        return success(res, 201, user)
    } catch (e) {
        return error(res, 501, e)
    }
})

export const logOut = asyncWrapper(async (req, res) => {
    // eslint-disable-next-line consistent-return
    req.logOut((err) => {
      // eslint-disable-next-line no-console
      if (err) return console.error(err);
    });
    return success(res, 200);
});
  