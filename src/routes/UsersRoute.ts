const express = require("express");
import Users from "../models/Users";
const UsersController = require("../controllers/UsersController");

const router = express.Router();

router.get("/", UsersController.getUsers);
router.post("/login", UsersController.login);
router.post("/add-user", UsersController.postUsers);
router.get("/get-user/:id", UsersController.getUserById);
router.post("/edit-user", UsersController.postEditUser);
router.delete("/delete-user/:id", UsersController.deleteUser);

module.exports = router;
