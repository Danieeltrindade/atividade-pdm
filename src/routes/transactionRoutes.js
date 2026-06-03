const { Router } = require("express");
const transactionController = require("../controllers/transactionController");
const authMiddleware = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { transactionPayloadSchema } = require("../schemas/transactionSchemas");

const router = Router();

router.use(authMiddleware);
router.get("/summary", transactionController.getSummary);
router.get("/", transactionController.listTransactions);
router.post("/", validate(transactionPayloadSchema), transactionController.createTransaction);
router.put("/:id", validate(transactionPayloadSchema), transactionController.updateTransaction);
router.delete("/:id", transactionController.deleteTransaction);

module.exports = router;
