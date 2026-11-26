import { Vendor, Review, User } from "../models";
import Paginate from "../common/paginate";
import { literal } from "sequelize";

class VendorRepository {
  static async getPublicVendorInfo(query: any) {
    const { pageNumber = 1, pageSize = 10, ...filters } = query;
    filters.type = "VENDOR";
    const attributes = ["id", "firstName", "country", "email", "countryCode", "phoneNumber"];
    const result = await Paginate(User, Number(pageNumber), Number(pageSize), filters, [], attributes);
    
    // Add average ratings to each vendor
    if (result.records && result.records.length > 0) {
      const vendorsWithRatings = await Promise.all(
        result.records.map(async (vendor: any) => {
          const avgRating = await Review.findOne({
            where: {
              reviewType: "VENDOR",
              vendor_id: vendor.id
            },
            attributes: [
              [literal('AVG(rating)'), 'averageRating'],
              [literal('COUNT(*)'), 'totalReviews']
            ],
            raw: true
          }) as any;

          return {
            ...vendor.toJSON(),
            averageRating: avgRating?.averageRating ? parseFloat(avgRating.averageRating).toFixed(2) : '0.00',
            totalReviews: avgRating?.totalReviews || 0
          };
        })
      );
      result.records = vendorsWithRatings as any;
    }
    
    return result;
  }
  
  static async getPublicVendorInfoById(id: any) {
    
    const attributes = ["id", "firstName", "country", "email", "countryCode", "phoneNumber"];
    const result = await User.findOne({
      where: { id, type: "VENDOR" },
      attributes
    });
    
    if (!result) {
      return null;
    }
    
    // Get vendor reviews
    const reviews = await Review.findAll({
      where: {
        reviewType: "VENDOR",
        vendor_id: id
      }
    });
    
    // Calculate rating statistics
    const totalReviews = reviews.length;
    let averageRating = 0;
    const ratingDistribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    if (totalReviews > 0) {
      const sum = reviews.reduce((acc, review) => acc + review.getDataValue('rating'), 0);
      averageRating = parseFloat((sum / totalReviews).toFixed(2));
      
      reviews.forEach(review => {
        const rating = review.getDataValue('rating');
        ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
      });
    }
    
    return {
      ...result.toJSON(),
      averageRating,
      totalReviews,
      ratingDistribution,
      reviews: reviews.map(r => r.toJSON())
    };
  }
}

export default VendorRepository;
