import { Request, Response, NextFunction } from "express";
import Customers from "../models/Customers"

interface Customer {
    id: string;
    name: string;
    phone: string;
}

exports.getCustomers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const customers = (await Customers.getAll()) as Customer[];
        res.json(customers)
    }catch (error) {
        console.error(error);
        res.status(500).json({message: "Lỗi"})
    }
}

exports.getPageCustomers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const customers = (await Customers.getAllPage(page, limit)) as Customer[];
      const totalCount = (await Customers.getTotalCount()) as number;
      const totalPages = Math.ceil(totalCount / limit);

      res.json({
        current_page: page,
            last_page: totalPages,
            total_items: totalCount,
            data: customers,
      })
  }catch (error) {
      console.error(error);
      res.status(500).json({message: "Lỗi"})
  }
}

exports.postAddCustomers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { name, phone }: { name: string, phone: string } = req.body;
      const newCustomersId = await Customers.add({ name, phone  });
      res.json({
        message: "Thêm khách hàng thành công",
        customersId: newCustomersId,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi" });
    }
};

exports.getCustomersById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const customerId = req.params.id as string;
      const customer = (await Customers.getById(customerId)) as Customer | null;
      if (!customer) {
        return res.status(404).json({ message: "Không tìm thấy khách hàng" });
      }
      res.json(customer);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi" });
    }
};

exports.postEditCustomers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id, name, phone }: { id: string; name: string, phone: string } = req.body;
      await Customers.update(id, { name, phone });
      res.json({ message: "Chinh sửa khách hàng thành công" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi" });
    }
};

exports.deleteCustomers = async (
  req: Request, 
  res: Response, 
  next: NextFunction
)  => {
  try {
    const { id } = req.params; 
    const hasOrders = await Customers.hasRelatedOrders(id);
    if (hasOrders) {
      return res.status(400).json({ message: "Không thể xóa khách hàng có đơn hàng liên quan. Vui lòng xóa các đơn hàng trước." });
    }
    await Customers.delete(Number(id)); 
    res.json({ message: "Xóa khách hàng thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi" });
  }
};

