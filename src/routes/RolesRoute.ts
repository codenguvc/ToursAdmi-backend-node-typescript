const express = require("express");
import Roles from "../models/Roles";
const RolesController = require("../controllers/RolesController");

const router = express.Router();

router.get("/", RolesController.getRoles);
router.get("/getPage", RolesController.getPageRoles);

router.post("/add-role", RolesController.postAddRole);
router.post("/edit-role/:id", RolesController.postEditRole);
router.delete("/delete-role/:id", RolesController.deleteRole);
router.get("/get-role/:id", RolesController.getRolesById);
router.post("/checkSlugAndRole", RolesController.checkSlugAndRole);
module.exports = router;
