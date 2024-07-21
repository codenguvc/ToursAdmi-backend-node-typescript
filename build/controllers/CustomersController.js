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
const Customers_1 = __importDefault(require("../models/Customers"));
exports.getCustomers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customers = (yield Customers_1.default.getAll());
        res.json(customers);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi" });
    }
});
exports.getPageCustomers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const customers = (yield Customers_1.default.getAllPage(page, limit));
        const totalCount = (yield Customers_1.default.getTotalCount());
        const totalPages = Math.ceil(totalCount / limit);
        res.json({
            current_page: page,
            last_page: totalPages,
            total_items: totalCount,
            data: customers,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi" });
    }
});
exports.postAddCustomers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, phone } = req.body;
        const newCustomersId = yield Customers_1.default.add({ name, phone });
        res.json({
            message: "Thêm khách hàng thành công",
            customersId: newCustomersId,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi" });
    }
});
exports.getCustomersById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customerId = req.params.id;
        const customer = (yield Customers_1.default.getById(customerId));
        if (!customer) {
            return res.status(404).json({ message: "Không tìm thấy khách hàng" });
        }
        res.json(customer);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi" });
    }
});
exports.postEditCustomers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name, phone } = req.body;
        yield Customers_1.default.update(id, { name, phone });
        res.json({ message: "Chinh sửa khách hàng thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi" });
    }
});
exports.deleteCustomers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const hasOrders = yield Customers_1.default.hasRelatedOrders(id);
        if (hasOrders) {
            return res.status(400).json({ message: "Không thể xóa khách hàng có đơn hàng liên quan. Vui lòng xóa các đơn hàng trước." });
        }
        yield Customers_1.default.delete(Number(id));
        res.json({ message: "Xóa khách hàng thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi" });
    }
});
