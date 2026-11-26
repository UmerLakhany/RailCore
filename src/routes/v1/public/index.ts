import express, { Router, Request, Response } from 'express';
import VendorService from '../../../services/vendor.service';
import CategoriesService from '../../../services/categories.service';
import ProductService from '../../../services/product.service';

const router: Router = express.Router();

router.get('/products', ProductService.getAllProducts);
router.get('/categories', CategoriesService.getAllCategories);
router.get('/vendors', VendorService.getPublicVendorInfo);
router.get('/vendors/:id', VendorService.getPublicVendorInfoById);
router.get('/menu', VendorService.getMenu);

export default router;