const express = require("express");
import DashBoard from "../models/Dashboard";

const DashboardController = require("../controllers/DashboardController");

const router = express.Router();

router.get("/", DashboardController.getTotalOrderPrice);
router.get("/amount-customer", DashboardController.getAmountCustomer);
router.get("/amount-order", DashboardController.getAmountOrders);
router.get("/orders-bylocation", DashboardController.getOrdersByLocation);
router.get("/revenue-by-location", DashboardController.getRevenuePercentageByLocation);


module.exports = router;