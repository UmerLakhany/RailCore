import express, { Router } from "express";
import AuthMiddleware from "../../auth/jwt";
import ReviewsService from "../../services/reviews.service";
import validateDTO from "../../dto/middlewares";
import ReviewDto from "../../dto/classes/Review.dto";

const router: Router = express.Router();

router.post('/', AuthMiddleware.auth, validateDTO(ReviewDto), ReviewsService.createReview);
router.get('/vendor/:vendorId', ReviewsService.getVendorReviews);
router.get('/product/:productId', ReviewsService.getProductReviews);
router.get('/rider/:riderId', ReviewsService.getRiderReviews);
router.get('/rider/:riderId/stats', ReviewsService.getRiderRatingStats);
router.get('/vendor/:vendorId/stats', ReviewsService.getVendorRatingStats);
router.get('/product/:productId/stats', ReviewsService.getProductRatingStats);

export default router;