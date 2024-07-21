const express = require("express");
import Tour from "../models/Tour";
const TourController = require("../controllers/TourController");

const router = express.Router();


router.get("/", TourController.getTours);

router.get("/getPage", TourController.getPagetTours);


router.post("/add-tour", TourController.postTour);


router.post("/edit-tour", TourController.postEditTour);


router.get("/get-tour/:id", TourController.getTourById);


router.delete("/delete-tour/:id", TourController.deleteTour);

module.exports = router;
