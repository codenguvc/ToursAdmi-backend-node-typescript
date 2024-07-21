import { Request, Response, NextFunction } from "express";
import Categories from "../models/Categories";

interface Category {
  id: string;
  name: string;
}

exports.getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = (await Categories.getAll()) as Category[];
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Loi" });
  }
};

exports.getPageCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const categories = (await Categories.getAllPage(page, limit)) as Category[];
    const totalCount = (await Categories.getTotalCount()) as number;
    const totalPages = Math.ceil(totalCount / limit);
    res.json({
      current_page: page,
      last_page: totalPages,
      total_items: totalCount,
      data: categories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Loi" });
  }
};

exports.postAddCate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name }: { name: string } = req.body;
    const newCategoryId = await Categories.add({ name });
    res.json({
      message: "Thêm mục thành công",
      categoryId: newCategoryId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi" });
  }
};

exports.getCategoriesById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cateId = req.params.id as string;
    const category = (await Categories.getById(cateId)) as Category | null;
    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }
    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi" });
  }
};

exports.postEditCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, name }: { id: string; name: string } = req.body;
    await Categories.update(id, { name });
    res.json({ message: "Chinh sửa danh mục thành công " });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi" });
  }
};

exports.deleteCategory = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const { id } = req.params; 
    const hasRelatedCategories = await Categories.hasRelatedCaterory(id);
    if (hasRelatedCategories) {
      return res.status(400).json({ message: "Không thể xóa danh mục có địa điểm liên quan. Vui lòng xóa các địa điểm trước." });
    }
    await Categories.delete(Number(id)); 
    res.json({ message: "Xóa danh mục thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi" });
  }
};


