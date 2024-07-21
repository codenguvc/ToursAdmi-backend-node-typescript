import { Request, Response, NextFunction } from "express";
import Tour from "../models/Tour"

interface Tours {
  id: string;
  name: string;
  location_id: string;
  start_date: string;
  end_date: string;
  price: string;
  description: string
}

exports.getTours = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tours = await Tour.getAll() as Tours[];
    res.json(tours);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi" });
  }
};


exports.getPagetTours = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const tours = (await Tour.getAllPage(page, limit)) as Tours[];
    const totalCount = (await Tour.getTotalCount()) as number;
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      current_page: page,
      last_page: totalPages,
      total_items: totalCount,
      data: tours,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi" });
  }
};


exports.postTour = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, location_id, start_date, end_date, price, description }: 
    { name: string, location_id: string, start_date: string, end_date: string, price: string, description: string } = req.body;

    const newTourId = await Tour.add({ name, location_id, start_date, end_date, price, description });

    res.json({
      message: "Thêm tour thành công",
      locationId: newTourId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi" });
  }
};

exports.getTourById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tourId = req.params.id as string;
    const tour = (await Tour.getById(tourId)) as Tours | null;
    if (!tour) {
      return res.status(404).json({ message: "Không tìm thấy tour" });
    }
    res.json(tour);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi" });
  }
};

exports.postEditTour = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, name, location_id, start_date, end_date, price, description }: { id: string; name: string; location_id: string; start_date: string; end_date: string; price: string; description: string } = req.body;
    await Tour.update(id, { name, location_id, start_date, end_date, price, description });
    res.json({ message: "Chỉnh sửa tour thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi" });
  }
};

exports.deleteTour = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const hasRelatedOrders = await Tour.hasRelatedTour(id);
    if (hasRelatedOrders) {
      return res.status(400).json({ message: "Không thể xóa tour có đơn hàng liên quan. Vui lòng xóa các đơn hàng trước." });
    }
    await Tour.delete(Number(id));
    res.json({ message: "Xóa tour thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi" });
  }
};

