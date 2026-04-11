const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.use(protect);
router.use(adminOnly);

router.get("/vendors", adminController.getAllVendors);
router.get("/vendors/:id", adminController.getVendorById);
router.get("/stats", adminController.getVendorStats);
router.put("/vendors/:id/approve-plan", adminController.approvePlanRequest);
router.put("/vendors/:id/reject-plan", adminController.rejectPlanRequest);
router.post("/send-greeting", adminController.sendGreeting);

module.exports = router;
