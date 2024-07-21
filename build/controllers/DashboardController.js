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
exports.getRevenuePercentageByLocation = exports.getOrdersByLocation = exports.getAmountOrders = exports.getAmountCustomer = exports.getTotalOrderPrice = void 0;
const Dashboard_1 = __importDefault(require("../models/Dashboard"));
const getTotalOrderPrice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const total = yield Dashboard_1.default.getCountTotal();
        res.json({ total });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error" });
    }
});
exports.getTotalOrderPrice = getTotalOrderPrice;
const getAmountCustomer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const total = yield Dashboard_1.default.getAmountCus();
        res.json({ total });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error" });
    }
});
exports.getAmountCustomer = getAmountCustomer;
const getAmountOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const total = yield Dashboard_1.default.getAmountOrder();
        res.json({ total });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error" });
    }
});
exports.getAmountOrders = getAmountOrders;
const getOrdersByLocation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield Dashboard_1.default.getOrdersByLocation();
        res.json({ data });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error" });
    }
});
exports.getOrdersByLocation = getOrdersByLocation;
const getRevenuePercentageByLocation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield Dashboard_1.default.getRevenuePercentageByLocation();
        res.json({ data });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error" });
    }
});
exports.getRevenuePercentageByLocation = getRevenuePercentageByLocation;
