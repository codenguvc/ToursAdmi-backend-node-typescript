import { Request, Response, NextFunction } from "express";
import Users from "../models/Users";

interface User {
  id: string;
  username: string;
  password: string;
  email: string;
  role_id: string;
}

exports.getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const users = (await Users.getAll(page, limit)) as User[];
    const totalCount = (await Users.getTotalCount()) as number;
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      current_page: page,
      last_page: totalPages,
      total_items: totalCount,
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi" });
  }
};

exports.getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id as string;
    const user = (await Users.getUserById(userId)) as User | null;
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Loi" });
  }
};

exports.deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (id === '1') {
      return res.status(403).json({ message: "Không thể xóa tài khoản này" });
    }

    await Users.delete(Number(id));
    res.json({ message: "Xóa người dùng thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi" });
  }
};


exports.postUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      username,
      password,
      email,
      role_id,
    }: { username: string; password: string; email: string; role_id: string } =
      req.body;

    const existingUser = await Users.findByEmailOrUsername(email, username);
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email hoặc username đã tồn tại" });
    }

    const newUserId = await Users.add({ username, password, email, role_id });
    res.json({
      message: "Thêm mới người dùng thành công",
      userId: newUserId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi" });
  }
};

exports.postEditUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      id,
      username,
      password,
      email,
      role_id,
    }: {
      id: string;
      username: string;
      password: string;
      email: string;
      role_id: string;
    } = req.body;

    const existingUser = await Users.findByEmailOrUsername(email, username, id);
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email hoặc username đã tồn tại" });
    }

    await Users.update(id, { username, password, email, role_id });
    res.json({ message: "Chỉnh sửa người dùng thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi" });
  }
};



exports.login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập email và password" });
    }

    const user = await Users.login(email, password);
    if (!user) {
      return res.status(401).json({ message: "Sai email hoặc password" });
    }

    return res.json({ message: "Đăng nhập thành công", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi" });
  }
};
