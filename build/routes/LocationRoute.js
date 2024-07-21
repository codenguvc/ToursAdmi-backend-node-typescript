"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const LocationController = require("../controllers/LocationController");
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path_1.default.join(__dirname, "../uploads"));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({ storage: storage });
router.get("/", LocationController.getLocation);
router.get("/getPage", LocationController.getPageLocation);
router.post("/add-loca", upload.single("image"), LocationController.postLocation);
router.post("/edit-loca", upload.single("image"), LocationController.postEditLocation);
router.get("/get-loca/:id", LocationController.getLocationById);
router.delete("/delete-loca/:id", LocationController.deleteLocation);
module.exports = router;
