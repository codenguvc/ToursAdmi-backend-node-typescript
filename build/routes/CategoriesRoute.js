"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const CategoriesController = require("../controllers/CategoriesController");
const router = express.Router();
/* ROUTER VIEW CATEGORY */
router.get("/", CategoriesController.getCategories);
router.get("/getPage", CategoriesController.getPageCategories);
router.post("/add-cate", CategoriesController.postAddCate);
/* ROUTER EDIT CATEGORY */
router.post("/edit-cate", CategoriesController.postEditCategories);
/* ROUTER GET DETAIL CATEGORY */
router.get("/get-cate/:id", CategoriesController.getCategoriesById);
/* ROUTER DELETE CATE */
router.delete("/delete-cate/:id", CategoriesController.deleteCategory);
module.exports = router;
