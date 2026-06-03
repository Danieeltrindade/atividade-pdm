const { Router } = require("express");
const categoryController = require("../controllers/categoryController");
const authMiddleware = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { categoryPayloadSchema } = require("../schemas/categorySchemas");

const router = Router();

router.use(authMiddleware);
router.get("/", categoryController.listCategories);
router.post("/", validate(categoryPayloadSchema), categoryController.createCategory);
router.put("/:id", validate(categoryPayloadSchema), categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
