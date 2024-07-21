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
exports.checkSlugAndRole = exports.postUpdateRolePermissions = exports.postEditRole = exports.postAddRole = void 0;
const Roles_1 = __importDefault(require("../models/Roles"));
exports.getRoles = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roles = (yield Roles_1.default.getAll());
        res.json(roles);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi" });
    }
});
exports.getPageRoles = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const roles = (yield Roles_1.default.getAllPage(page, limit));
        const totalCount = (yield Roles_1.default.getTotalCount());
        const totalPages = Math.ceil(totalCount / limit);
        res.json({
            current_page: page,
            last_page: totalPages,
            total_items: totalCount,
            data: roles,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi" });
    }
});
const postAddRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, permissions } = req.body;
        const newRoleId = yield Roles_1.default.add({ name });
        const roleId = newRoleId;
        yield Roles_1.default.addRolePermissions(roleId, permissions);
        res.json({
            message: "Thêm phân quyền thành công",
            roleId: roleId,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi" });
    }
});
exports.postAddRole = postAddRole;
exports.getRolesById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const role_id = req.params.id;
        const role = yield Roles_1.default.getById(role_id);
        if (!role) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy danh phân quyền" });
        }
        res.json(role);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi" });
    }
});
const postEditRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roleId = parseInt(req.params.id, 10);
        const { name, permissions } = req.body;
        if (isNaN(roleId) || !name || !Array.isArray(permissions)) {
            return res.status(400).json({ message: "Dữ liệu không hợp lệ" });
        }
        const roleData = { name, permissionIds: permissions };
        yield Roles_1.default.update(roleId, roleData);
        res.status(200).json({ message: "Cập nhật phân quyền thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi" });
    }
});
exports.postEditRole = postEditRole;
const postUpdateRolePermissions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roleId = parseInt(req.params.id);
        const { permissionIds } = req.body;
        yield Roles_1.default.updateRolePermissions(roleId, permissionIds);
        res.json({ message: "Cập nhật quyền của vai trò thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi" });
    }
});
exports.postUpdateRolePermissions = postUpdateRolePermissions;
exports.deleteRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const roleInUse = yield Roles_1.default.checkRoleInUse(Number(id));
        if (roleInUse) {
            return res
                .status(400)
                .json({ message: "Vai trò đang được sử dụng và không thể xóa." });
        }
        yield Roles_1.default.delete(Number(id));
        res.json({ message: "Xóa phân quyền thành công" });
    }
    catch (error) {
        console.error(error);
        next(error);
    }
});
const checkSlugAndRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { slug, roleId } = req.body;
        if (!slug || isNaN(roleId)) {
            return res.status(400).json({ message: "Dữ liệu không hợp lệ" });
        }
        const isValid = yield Roles_1.default.checkSlugAndRole(slug, roleId);
        res.json({ isValid });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi" });
    }
});
exports.checkSlugAndRole = checkSlugAndRole;
