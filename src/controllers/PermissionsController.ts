import { Request, Response, NextFunction } from "express";
import Permissions from "../models/Permissions";
import { permission } from "process";

interface Permission {
    id: string;
    name: string;
    slug: string;
}

exports.getPermissions = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const permissions = (await Permissions.getAll()) as Permission[];
        res.json(permissions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi" });
    }
};

exports.getPagePermissions = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const permissions = (await Permissions.getAllPage(page, limit)) as Permission[];
        const totalCount = (await Permissions.getTotalCount()) as number;
        const totalPages = Math.ceil(totalCount / limit);

        res.json({
            current_page: page,
            last_page: totalPages,
            total_items: totalCount,
            data: permissions,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi" });
    }
};

exports.postAddPermissions = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { name, slug }: { name: string; slug: string } = req.body;
        const newPermissionId = await Permissions.add({ name, slug });
        res.json({
            message: "Thêm quyền thành công",
            permission: newPermissionId,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi" });
    }
};

exports.getPermissionsById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const permissionId = req.params.id as string;
        const permission = (await Permissions.getById(permissionId)) as Permission | null;
        if (!permission) {
            return res.status(404).json({ message: "Không tìm thấy quyền" });
        }
        res.json(permission);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi" });
    }
};

exports.postEditPermissions = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id, name, slug }: { id: string; name: string; slug: string } = req.body;
        await Permissions.update(id, { name, slug });
        res.json({ message: "Chỉnh quyền thành công" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi" });
    }
};

exports.deletePermission = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        await Permissions.delete(Number(id));
        res.json({ message: 'Xóa quyền thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi' });
    }
};