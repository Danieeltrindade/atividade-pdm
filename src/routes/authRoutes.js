const { Router } = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { loginSchema, registerSchema } = require("../schemas/authSchemas");

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.get("/me", authMiddleware, authController.me);

module.exports = router;
