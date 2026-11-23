// import Order from "../Orders";
// import OrderItem from "../OrderItems";
// import Customer from "../Customers";
// import Vendor from "../Vendors";
// import Product from "../Products";
// import Payment from "../Payments";
// import PromoCode from "../PromoCodes";
// import Rider from "../Riders";
// import User from "../Users";

// // Order Relations
// Order.belongsTo(Customer, { foreignKey: 'customerId', targetKey: 'customer_id', as: 'customer' });
// Order.belongsTo(Vendor, { foreignKey: 'vendorId', targetKey: 'id', as: 'vendor' });
// Order.belongsTo(Rider, { foreignKey: 'riderId', targetKey: 'rider_id', as: 'rider' });
// Order.belongsTo(Payment, { foreignKey: 'paymentId', as: 'payment' });
// Order.belongsTo(PromoCode, { foreignKey: 'promoCodeId', as: 'promoCode' });
// Order.hasMany(OrderItem, { foreignKey: 'order_id', sourceKey: 'id', as: 'orderItems' });

// // OrderItem Relations
// OrderItem.belongsTo(Order, { foreignKey: 'order_id', targetKey: 'id', as: 'order' });
// OrderItem.belongsTo(Product, { foreignKey: 'product_id', targetKey: 'product_id', as: 'product' });

// // Customer Relations
// Customer.hasMany(Order, { foreignKey: 'customerId', sourceKey: 'customer_id', as: 'orders' });
// Customer.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// // Vendor Relations
// Vendor.hasMany(Order, { foreignKey: 'vendorId', sourceKey: 'id', as: 'orders' });
// Vendor.hasMany(Product, { foreignKey: 'vendor_id', sourceKey: 'id', as: 'products' });
// Vendor.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// // Product Relations
// Product.belongsTo(Vendor, { foreignKey: 'vendor_id', targetKey: 'id', as: 'vendor' });
// Product.hasMany(OrderItem, { foreignKey: 'product_id', sourceKey: 'product_id', as: 'orderItems' });

// // Payment Relations
// Payment.hasOne(Order, { foreignKey: 'paymentId', as: 'order' });
// Payment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// // Rider Relations
// Rider.hasMany(Order, { foreignKey: 'riderId', sourceKey: 'rider_id', as: 'orders' });
// Rider.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// // PromoCode Relations
// PromoCode.belongsTo(Vendor, { foreignKey: 'vendorId', as: 'vendor' });
// PromoCode.hasMany(Order, { foreignKey: 'promoCodeId', as: 'orders' });

// export {
//   Order,
//   OrderItem,
//   Customer,
//   Vendor,
//   Product,
//   Payment,
//   PromoCode,
//   Rider,
//   User
// };
