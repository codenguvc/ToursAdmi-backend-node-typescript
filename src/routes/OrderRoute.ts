const express = require("express");
const OrderController = require("../controllers/OrderController");

const router = express.Router();


router.get("/", OrderController.getOrder);

router.post("/add-order", OrderController.postOrder);


router.post("/edit-order", OrderController.postEditOrder);

router.get("/get-order/:id", OrderController.getOrderById);


router.delete("/delete-order/:id", OrderController.deleteOrder);

module.exports = router;
