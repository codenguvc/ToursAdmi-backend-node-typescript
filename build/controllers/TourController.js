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
const Tour_1 = __importDefault(require("../models/Tour"));
exports.getTours = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tours = yield Tour_1.default.getAll();
        res.json(tours);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi" });
    }
});
exports.getPagetTours = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const tours = (yield Tour_1.default.getAllPage(page, limit));
        const totalCount = (yield Tour_1.default.getTotalCount());
        const totalPages = Math.ceil(totalCount / limit);
        res.json({
            current_page: page,
            last_page: totalPages,
            total_items: totalCount,
            data: tours,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi" });
    }
});
exports.postTour = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, location_id, start_date, end_date, price, description } = req.body;
        const newTourId = yield Tour_1.default.add({ name, location_id, start_date, end_date, price, description });
        res.json({
            message: "Thêm tour thành công",
            locationId: newTourId,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi" });
    }
});
exports.getTourById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tourId = req.params.id;
        const tour = (yield Tour_1.default.getById(tourId));
        if (!tour) {
            return res.status(404).json({ message: "Không tìm thấy tour" });
        }
        res.json(tour);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi" });
    }
});
exports.postEditTour = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name, location_id, start_date, end_date, price, description } = req.body;
        yield Tour_1.default.update(id, { name, location_id, start_date, end_date, price, description });
        res.json({ message: "Chỉnh sửa tour thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi" });
    }
});
exports.deleteTour = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const hasRelatedOrders = yield Tour_1.default.hasRelatedTour(id);
        if (hasRelatedOrders) {
            return res.status(400).json({ message: "Không thể xóa tour có đơn hàng liên quan. Vui lòng xóa các đơn hàng trước." });
        }
        yield Tour_1.default.delete(Number(id));
        res.json({ message: "Xóa tour thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi" });
    }
});
