import { Request, Response, NextFunction } from "express";
import Location from "../models/Location";

interface Locations {
  id: string;
  name: string;
  image: string;
  category_id: string;
}

exports.getLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const locations = await Location.getAll() as Locations[];
    res.json(locations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi" });
  }
};

exports.getPageLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const locations = await Location.getAllPage(page, limit) as Locations[];
    const totalCount = (await Location.getTotalCount()) as number;
    const totalPages = Math.ceil(totalCount / limit);
    res.json({
      current_page: page,
      last_page: totalPages,
      total_items: totalCount,
      data: locations,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi" });
  }
};

exports.postLocation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { locationName, category_id } = req.body;
    const image = req.file ? (req.file as Express.Multer.File).filename : '';
    await Location.add({ name: locationName, image, category_id });
    res.status(201).json({ message: 'Location added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding location' });
  }
};

exports.postEditLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, name, category_id }: { id: string, name: string, category_id: string } = req.body;
    let image = "";
    if (req.file) {
      image = (req.file as Express.Multer.File).filename; 
    }

    await Location.update(id, { name, category_id, image });
    res.json({ message: "Chỉnh sửa địa điểm thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi" });
  }
};



exports.getLocationById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const locaId = req.params.id as string;
    const location = (await Location.getById(locaId)) as Locations | null;
    if (!location) {
      return res.status(404).json({ message: "Không tìm thấy địa điểm" });
    }
    res.json(location);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi" });
  }
};




exports.deleteLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params; 
    const hasRelatedTours = await Location.hasRelatedTours(id);
    if (hasRelatedTours) {
      return res.status(400).json({ message: "Không thể xóa địa điểm có tour liên quan. Vui lòng xóa các tour trước." });
    }
    await Location.delete(Number(id)); 
    res.json({ message: "Xóa địa điểm thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi" });
  }
};
