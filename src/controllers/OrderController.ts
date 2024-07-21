import { Request, Response, NextFunction } from "express";
import Orders from "../models/Order";

interface OrderRequest {
    tour_id: string;
    customer_id: string;
    customer_name: string;
    customer_email: string;
    booking_date: string;
}

exports.getOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await Orders.getAll();
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Loi" });
    }
};

exports.postOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { tour_id, customer_id, customer_name, customer_email, booking_date }: OrderRequest = req.body;
        const newOrderId = await Orders.add({ tour_id, customer_id, customer_name, customer_email, booking_date });
        res.json({
            message: "Thêm đơn hàng thành công",
            orderId: newOrderId,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Loi" });
    }
};

exports.getOrderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderId = req.params.id as string;
        const order = await Orders.getById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Loi" });
    }
};

exports.postEditOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, tour_id, customer_id, customer_name, customer_email, booking_date }: { id: string, tour_id: string, customer_id: string, customer_name: string, customer_email: string, booking_date: string } = req.body;
        const success = await Orders.update(id, { tour_id, customer_id, customer_name, customer_email, booking_date });
        if (success) {
            res.json({ message: "Chỉnh sửa đơn hàng thành công" });
        } else {
            res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Loi" });
    }
};

exports.deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const success = await Orders.delete(Number(id));
        if (success) {
            res.json({ message: "Xóa đơn hàng thành công" });
        } else {
            res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Loi" });
    }
};
