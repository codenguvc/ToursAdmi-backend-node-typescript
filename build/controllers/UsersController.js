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
const Users_1 = __importDefault(require("../models/Users"));
exports.getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const users = (yield Users_1.default.getAll(page, limit));
        const totalCount = (yield Users_1.default.getTotalCount());
        const totalPages = Math.ceil(totalCount / limit);
        res.json({
            current_page: page,
            last_page: totalPages,
            total_items: totalCount,
            data: users,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi" });
    }
});
exports.getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const user = (yield Users_1.default.getUserById(userId));
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }
        res.json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Loi" });
    }
});
exports.deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (id === '1') {
            return res.status(403).json({ message: "Không thể xóa tài khoản này" });
        }
        yield Users_1.default.delete(Number(id));
        res.json({ message: "Xóa người dùng thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi" });
    }
});
exports.postUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, email, role_id, } = req.body;
        const existingUser = yield Users_1.default.findByEmailOrUsername(email, username);
        if (existingUser) {
            return res
                .status(400)
                .json({ message: "Email hoặc username đã tồn tại" });
        }
        const newUserId = yield Users_1.default.add({ username, password, email, role_id });
        res.json({
            message: "Thêm mới người dùng thành công",
            userId: newUserId,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi" });
    }
});
exports.postEditUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, username, password, email, role_id, } = req.body;
        const existingUser = yield Users_1.default.findByEmailOrUsername(email, username, id);
        if (existingUser) {
            return res
                .status(400)
                .json({ message: "Email hoặc username đã tồn tại" });
        }
        yield Users_1.default.update(id, { username, password, email, role_id });
        res.json({ message: "Chỉnh sửa người dùng thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi" });
    }
});
exports.login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Vui lòng nhập email và password" });
        }
        const user = yield Users_1.default.login(email, password);
        if (!user) {
            return res.status(401).json({ message: "Sai email hoặc password" });
        }
        return res.json({ message: "Đăng nhập thành công", user });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi" });
    }
});
