import { Router } from "express";
import authRoutes from './Auth.js'
import contactRoutes from './Contact.js'

const router = Router();

router.get("/", (req, res) => {
  res.status(200).send({
    message: `Hello from homepage. Check the API specification for further guidiance and next steps.`,
    success: 1,
  });
});

router.use('/auth', authRoutes)
router.use('/contact', contactRoutes)

export default router;