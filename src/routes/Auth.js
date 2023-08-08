import { Router } from "express";
import { logOut, signIn, signUp } from "../controllers/Auth.js";
import { loginSchema, signUpSchema, validator } from "../helpers/validator.js";
import { uploadImage } from "../services/storage.js";
import { validateUsersAuthRequest } from "../base/auth.js";

const router = Router();

router.post('/login', validator.body(loginSchema), validateUsersAuthRequest, signIn)
router.post('/signup', validator.body(signUpSchema), uploadImage.single('avatar'), signUp)
router.get('/logout', logOut)

export default router