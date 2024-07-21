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
const Categories_1 = __importDefault(require("../models/Categories"));
exports.getCategories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = (yield Categories_1.default.getAll());
        res.json(categories);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Loi" });
    }
});
exports.getPageCategories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const categories = (yield Categories_1.default.getAllPage(page, limit));
        const totalCount = (yield Categories_1.default.getTotalCount());
        const totalPages = Math.ceil(totalCount / limit);
        res.json({
            current_page: page,
            last_page: totalPages,
            total_items: totalCount,
            data: categories,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Loi" });
    }
});
exports.postAddCate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        const newCategoryId = yield Categories_1.default.add({ name });
        res.json({
            message: "Thêm mục thành công",
            categoryId: newCategoryId,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi" });
    }
});
exports.getCategoriesById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cateId = req.params.id;
        const category = (yield Categories_1.default.getById(cateId));
        if (!category) {
            return res.status(404).json({ message: "Không tìm thấy danh mục" });
        }
        res.json(category);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi" });
    }
});
exports.postEditCategories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name } = req.body;
        yield Categories_1.default.update(id, { name });
        res.json({ message: "Chinh sửa danh mục thành công " });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi" });
    }
});
exports.deleteCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const hasRelatedCategories = yield Categories_1.default.hasRelatedCaterory(id);
        if (hasRelatedCategories) {
            return res.status(400).json({ message: "Không thể xóa danh mục có địa điểm liên quan. Vui lòng xóa các địa điểm trước." });
        }
        yield Categories_1.default.delete(Number(id));
        res.json({ message: "Xóa danh mục thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi" });
    }
});
