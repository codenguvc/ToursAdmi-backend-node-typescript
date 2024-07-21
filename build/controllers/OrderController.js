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
const Order_1 = __importDefault(require("../models/Order"));
exports.getOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield Order_1.default.getAll();
        res.json(orders);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Loi" });
    }
});
exports.postOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tour_id, customer_id, customer_name, customer_email, booking_date } = req.body;
        const newOrderId = yield Order_1.default.add({ tour_id, customer_id, customer_name, customer_email, booking_date });
        res.json({
            message: "Thêm đơn hàng thành công",
            orderId: newOrderId,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Loi" });
    }
});
exports.getOrderById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = req.params.id;
        const order = yield Order_1.default.getById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }
        res.json(order);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Loi" });
    }
});
exports.postEditOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, tour_id, customer_id, customer_name, customer_email, booking_date } = req.body;
        const success = yield Order_1.default.update(id, { tour_id, customer_id, customer_name, customer_email, booking_date });
        if (success) {
            res.json({ message: "Chỉnh sửa đơn hàng thành công" });
        }
        else {
            res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Loi" });
    }
});
exports.deleteOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const success = yield Order_1.default.delete(Number(id));
        if (success) {
            res.json({ message: "Xóa đơn hàng thành công" });
        }
        else {
            res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Loi" });
    }
});
