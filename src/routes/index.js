const { Router } = require("express");
const authRoutes = require("./authRoutes");
const categoryRoutes = require("./categoryRoutes");
const transactionRoutes = require("./transactionRoutes");

const router = Router();

router.get("/", (_request, response) => {
  response.json({
    status: "ok",
    message: "PDM API is running",
  });
});

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/transactions", transactionRoutes);

module.exports = router;
