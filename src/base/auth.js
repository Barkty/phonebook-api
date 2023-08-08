import passport from "passport";
import asyncWrapper from "../middlewares/async.js";
import { openRoutes } from "./request.js";
import { error } from "../helpers/response.js";

const authMiddleware = asyncWrapper(async (req, res, next) => {
  const isOpenRoute = openRoutes.some((route) => req.method === route.method && req.path === route.path);
  if (isOpenRoute) return next();
  if (req.isAuthenticated() && !req.user.isController) return next();
  return error(res, 401, "You are not logged in");
});
  
export const validateUsersAuthRequest = (req, res, next) =>
    passport.authenticate("local", async (err, user) => {
      if (err) return error(res, 401, err.message || err);
      // if (!checkEnvironment("production")) {
      //     let passwordRetryCount;
      //     if (!user || (user && user?.isController)) {
      //         const isUser = await User.findOne({ email: req.body.email });
      //         if (isUser) {
      //             if (isUser.passwordRetryCount === 0) {
      //                 return error(
      //                     res,
      //                     400,
      //                     "Account has been flagged for multiple wrong password entry. Kindly contact admin"
      //                 );
      //             }
      //             passwordRetryCount = Number(isUser.passwordRetryCount) - 1;
      //             await User.updateOne({ _id: ObjectId(isUser._id) }, { passwordRetryCount });
      //         }
      //         return error(
      //             res,
      //             401,
      //             !isUser
      //                 ? "Invalid email or password"
      //                 : `Invalid email or password. You have ${passwordRetryCount} trial left`
      //         );
      //     }
      // }
      return req.logIn(user, async (_error) => {
        if (_error) {
          return next(_error);
        }
        return next();
      });
})(req, res, next);

export default authMiddleware;