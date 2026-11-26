import { Request, Response } from 'express';
import vendorData from '../data/vendordata.json';
import VendorRepository from '../repositories/vendor.repository';
import ProductService from './product.service';
import asyncHandler from '../common/asyncHandler';
import { Order, Product } from '../models';
import { Op } from 'sequelize';

class VendorService {
  static async getPublicVendorInfo(req: Request, res: Response) {
    let result: any = await VendorRepository.getPublicVendorInfo(req.query);
    result = result?.dataValues || result;
    
    res.generalResponse("Vendor info fetched successfully", result);
  }
  
  static async getPublicVendorInfoById(req: Request, res: Response) {
    const { id } = req.params;
    let result: any = await VendorRepository.getPublicVendorInfoById(id);
    result = result?.dataValues || result;
    
    res.generalResponse("Vendor info fetched successfully", result);
  }

  static async getMenu(req: Request, res: Response) {
    // For demo, returning static data
    const { vendor_id } = req.query;
    if(!vendor_id){
      return res.generalError("Vendor ID is required", null, 400);
    }

    const result = await ProductService.getAllProducts(req, res);

    res.generalResponse("Menu fetched successfully", result);
  }

  static getDashboardData = asyncHandler(async (req: Request, res: Response) => {
    const totalItems = await Product.findAndCountAll({ where: { vendor_id: req?.user?.id } });
    const totalInStock = await Product.findAndCountAll({ where: { vendor_id: req?.user?.id, quantity: { [Op.gt]: 0 } } });
    const currentOrders = await Order.findAndCountAll({ where: { vendorId: req?.user?.id, status: { [Op.in]: ["PENDING", "ACCEPTED", "IN_TRANSIT"] } }});
    const result = {
      totalInStock,
      totalItems,
      currentOrders
    }
    res.generalResponse("Data fetched Successfuly", result)
  });
}

export default VendorService;