import { Router } from "express";
import authController from "../controllers/auth.controller";
import { protect } from "../middlewares/auth.middleware";
const router = Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout', authController.logout);
router.post('/refresh-token', authController.refreshToken);
router.get('/me', protect, authController.getMe);

export default router