const express = require("express");
import Customers from "../models/Customers";
const CustomersController = require("../controllers/CustomersCOntroller");

const router = express.Router();

/* ROUTER VIEW CUSTOMERS */
router.get("/", CustomersController.getCustomers);

router.get("/getPage", CustomersController.getPageCustomers);


router.post("/add-customers", CustomersController.postAddCustomers);

/* ROUTER EDIT CUSTOMERS */
router.post("/edit-customers", CustomersController.postEditCustomers);

/* ROUTER GET DETAIL CUSTOMERS */
router.get("/get-customers/:id", CustomersController.getCustomersById);

/* ROUTER DELETE CUSTOMERS */
router.delete("/delete-customers/:id", CustomersController.deleteCustomers);


module.exports = router;
