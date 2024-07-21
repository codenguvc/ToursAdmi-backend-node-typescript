"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Location_1 = __importDefault(require("../models/Location"));
exports.getLocation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const locations = yield Location_1.default.getAll();
        res.json(locations);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi" });
    }
});
exports.getPageLocation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const locations = yield Location_1.default.getAllPage(page, limit);
        const totalCount = (yield Location_1.default.getTotalCount());
        const totalPages = Math.ceil(totalCount / limit);
        res.json({
            current_page: page,
            last_page: totalPages,
            total_items: totalCount,
            data: locations,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi" });
    }
});
exports.postLocation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { locationName, category_id } = req.body;
        const image = req.file ? req.file.filename : '';
        yield Location_1.default.add({ name: locationName, image, category_id });
        res.status(201).json({ message: 'Location added successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding location' });
    }
});
exports.postEditLocation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name, category_id } = req.body;
        let image = "";
        if (req.file) {
            image = req.file.filename;
        }
        yield Location_1.default.update(id, { name, category_id, image });
        res.json({ message: "Chỉnh sửa địa điểm thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi" });
    }
});
exports.getLocationById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const locaId = req.params.id;
        const location = (yield Location_1.default.getById(locaId));
        if (!location) {
            return res.status(404).json({ message: "Không tìm thấy địa điểm" });
        }
        res.json(location);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi" });
    }
});
exports.deleteLocation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const hasRelatedTours = yield Location_1.default.hasRelatedTours(id);
        if (hasRelatedTours) {
            return res.status(400).json({ message: "Không thể xóa địa điểm có tour liên quan. Vui lòng xóa các tour trước." });
        }
        yield Location_1.default.delete(Number(id));
        res.json({ message: "Xóa địa điểm thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi" });
    }
});
