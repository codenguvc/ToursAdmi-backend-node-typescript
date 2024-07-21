import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import Location from "../models/Location";
import path from "path";
const LocationController = require("../controllers/LocationController");


const router = express.Router();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });


router.get("/", LocationController.getLocation);

router.get("/getPage", LocationController.getPageLocation);

router.post("/add-loca", upload.single("image"), LocationController.postLocation);
router.post("/edit-loca", upload.single("image"), LocationController.postEditLocation);
router.get("/get-loca/:id", LocationController.getLocationById);
router.delete("/delete-loca/:id", LocationController.deleteLocation);

module.exports = router;