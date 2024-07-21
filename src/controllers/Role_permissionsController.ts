import { Request, Response, NextFunction } from "express";
import Rolepermissions from "../models/Role_permissions";


interface Role_permission {
    id: string;
    role_id: string;
    permission_id: string;
  }