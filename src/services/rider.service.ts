import { Request, Response } from "express";
import asyncHandler from "../common/asyncHandler";
import { Order } from "../models";

class RiderService {
  static getDashboardData = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.user;

    const totalDeliveries = await Order.findAndCountAll({ where: { riderId: id, status: 'DELIVERED' } });
    const pendingDeliveries = await Order.findAndCountAll({ where: { riderId: id, status: 'PENDING' } });
    const earningsThisMonth = await Order.findAndCountAll({ where: { riderId: id, status: 'DELIVERED', updatedAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } } });
    const result = {
      totalDeliveries,
      pendingDeliveries,
      earningsThisMonth,
    };
    res.generalResponse("Rider dashboard data fetched successfully", result);
  });
}

export default RiderService;