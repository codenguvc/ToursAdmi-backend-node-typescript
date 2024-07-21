import { Request, Response, NextFunction } from "express";
import Dashboard from "../models/Dashboard";
import Order from "../models/Order";
import Customers from "../models/Customers";
import Tour from "../models/Tour";
import Location from "../models/Location";

interface Orders {
    id: string;
    tour_id: string;
    customer_id: string;
    customer_name: string;
    customer_email: string;
    booking_date: string;
    total_price: string;
}

interface Tours {
    id: string;
    name: string;
    location_id: string;
    start_date: string;
    end_date: string;
    price: string;
    description: string
}

interface Customer {
    id: string;
    name: string;
    phone: string;
}


interface Locations {
    id: string;
    name: string;
    image: string;
    category_id: string;
  }

export const getTotalOrderPrice = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const total = await Dashboard.getCountTotal(); 
        res.json({ total });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error" });
    }
}


export const getAmountCustomer = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const total = await Dashboard.getAmountCus(); 
        res.json({ total });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error" });
    }
}



export const getAmountOrders = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const total = await Dashboard.getAmountOrder(); 
        res.json({ total });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error" });
    }
}

export const getOrdersByLocation = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const data = await Dashboard.getOrdersByLocation();
        res.json({ data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error" });
    }
}

export const getRevenuePercentageByLocation = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const data = await Dashboard.getRevenuePercentageByLocation();
        res.json({ data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error" });
    }
}
