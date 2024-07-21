import { Request, Response, NextFunction } from "express";
import Roles from "../models/Roles";
import { link } from "fs";

interface Role {
  id: string;
  name: string;
}

exports.getRoles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roles = (await Roles.getAll()) as Role[];
    res.json(roles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi" });
  }
};

exports.getPageRoles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const roles = (await Roles.getAllPage(page, limit)) as Role[];
    const totalCount = (await Roles.getTotalCount()) as number;
    const totalPages = Math.ceil(totalCount / limit);
    res.json({
      current_page: page,
            last_page: totalPages,
            total_items: totalCount,
            data: roles,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi" });
  }
};

export const postAddRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, permissions }: { name: string; permissions: number[] } =
      req.body;
    const newRoleId = await Roles.add({ name });
    const roleId = newRoleId as number;

    await Roles.addRolePermissions(roleId, permissions);

    res.json({
      message: "Thêm phân quyền thành công",
      roleId: roleId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi" });
  }
};

exports.getRolesById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const role_id = req.params.id as string;
    const role = await Roles.getById(role_id);
    if (!role) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy danh phân quyền" });
    }
    res.json(role);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi" });
  }
};

export const postEditRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const roleId = parseInt(req.params.id, 10);
    const { name, permissions } = req.body;

    if (isNaN(roleId) || !name || !Array.isArray(permissions)) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ" });
    }

    const roleData = { name, permissionIds: permissions };

    await Roles.update(roleId, roleData);

    res.status(200).json({ message: "Cập nhật phân quyền thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi" });
  }
};

export const postUpdateRolePermissions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const roleId: number = parseInt(req.params.id);
    const { permissionIds }: { permissionIds: number[] } = req.body;

    await Roles.updateRolePermissions(roleId, permissionIds);

    res.json({ message: "Cập nhật quyền của vai trò thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi" });
  }
};

exports.deleteRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const roleInUse = await Roles.checkRoleInUse(Number(id));
    if (roleInUse) {
      return res
        .status(400)
        .json({ message: "Vai trò đang được sử dụng và không thể xóa." });
    }
    await Roles.delete(Number(id));
    res.json({ message: "Xóa phân quyền thành công" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const checkSlugAndRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slug, roleId }: { slug: string; roleId: number } = req.body;

    if (!slug || isNaN(roleId)) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ" });
    }

    const isValid = await Roles.checkSlugAndRole(slug, roleId);

    res.json({ isValid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi" });
  }
};
