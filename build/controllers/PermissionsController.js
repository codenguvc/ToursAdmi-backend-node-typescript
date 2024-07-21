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
const Permissions_1 = __importDefault(require("../models/Permissions"));
exports.getPermissions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const permissions = (yield Permissions_1.default.getAll());
        res.json(permissions);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi" });
    }
});
exports.getPagePermissions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const permissions = (yield Permissions_1.default.getAllPage(page, limit));
        const totalCount = (yield Permissions_1.default.getTotalCount());
        const totalPages = Math.ceil(totalCount / limit);
        res.json({
            current_page: page,
            last_page: totalPages,
            total_items: totalCount,
            data: permissions,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi" });
    }
});
exports.postAddPermissions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, slug } = req.body;
        const newPermissionId = yield Permissions_1.default.add({ name, slug });
        res.json({
            message: "Thêm quyền thành công",
            permission: newPermissionId,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi" });
    }
});
exports.getPermissionsById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const permissionId = req.params.id;
        const permission = (yield Permissions_1.default.getById(permissionId));
        if (!permission) {
            return res.status(404).json({ message: "Không tìm thấy quyền" });
        }
        res.json(permission);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi" });
    }
});
exports.postEditPermissions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name, slug } = req.body;
        yield Permissions_1.default.update(id, { name, slug });
        res.json({ message: "Chỉnh quyền thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi" });
    }
});
exports.deletePermission = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield Permissions_1.default.delete(Number(id));
        res.json({ message: 'Xóa quyền thành công' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi' });
    }
});
