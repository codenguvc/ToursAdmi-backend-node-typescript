"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const UsersController = require("../controllers/UsersController");
const router = express.Router();
router.get("/", UsersController.getUsers);
router.post("/login", UsersController.login);
router.post("/add-user", UsersController.postUsers);
router.get("/get-user/:id", UsersController.getUserById);
router.post("/edit-user", UsersController.postEditUser);
router.delete("/delete-user/:id", UsersController.deleteUser);
module.exports = router;
