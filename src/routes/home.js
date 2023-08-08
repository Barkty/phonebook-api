import { Router } from "express";
import contactRoutes from '../models/Contact.js'

const router = Router();

router.get("/", (req, res) => {
  res.status(200).send({
    message: `Hello from homepage. Check the API specification for further guidiance and next steps.`,
    success: 1,
  });
});

router.use('/contact', contactRoutes)

export default router;