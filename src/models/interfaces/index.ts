export interface OtpAttributes {
  id?: number;
  otp: string;
  email: string;
  type: string;
  phoneNumber: string;
  createdAt?: Date;
  expiresAt?: Date;
  isUsed?: boolean;
}
export interface CustomerAttributes {
  customer_id?: number;
  user_id: number;
  phone: string;
  email: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CustomerAddressAttributes {
  address_id?: number;
  customer_id: number;
  address: string;
  latitude: string;
  longitude: string;
  label?: string;
}

export interface ProductAttributes {
  product_id?: number;
  vendor_id: number;
  category_id: number;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  is_active?: boolean;
}

export interface OrderItemAttributes {
  order_item_id?: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
}

export interface WalletTransactionAttributes {
  transaction_id?: number;
  wallet_id: number;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  description?: string;
  created_at?: Date;
}

export interface WithdrawalAttributes {
  withdrawal_id?: number;
  wallet_id: number;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  requested_at?: Date;
  processed_at?: Date;
}

export interface ReviewAttributes {
  id?: number;
  user_id: number;
  reviewType: 'VENDOR' | 'ITEM' | 'DEAL';
  vendor_id?: number;
  item_id?: number;
  deal_id?: number;
  rider_id?: number;
  rating: number;
  comment?: string;
  created_at?: Date;
}

export interface RiderAttributes {
  rider_id?: number;
  user_id: number;
  drivingLicence?: string;
  vehicle_number: any;
  is_active?: boolean;
}

export interface AdminLogAttributes {
  log_id?: number;
  admin_id: number;
  action: string;
  details?: string;
  created_at?: Date;
}

export interface NotificationAttributes {
  notification_id?: number;
  user_id: number;
  title: string;
  message: string;
  is_read?: boolean;
  created_at?: Date;
}

export interface PermissionAttributes {
  permission_id?: number;
  role_id: number;
  page_id: number;
  action: string;
}

export interface VendorAddressAttributes {
  address_id?: number;
  vendor_id: number;
  address: string;
  latitude: string;
  longitude: string;
  label?: string;
}
export interface CategoryAttributes {
  category_id?: number;
  vendor_id: number;
  name: string;
  icon_url?: string;
  isDeleted?: boolean;
}

export type VendorBusinessType = 'RESTAURANT' | 'GROCERY';
export interface VendorAttributes {
  id?: number;
  userId: number;
  businessName: string;
  businessType: VendorBusinessType;
  address: string;
  isActive?: boolean;
}

export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
export interface OrderAttributes {
  id?: number;
  customerId: number;
  vendorId: number;
  riderId?: number | null;
  status: OrderStatus;
  totalAmount: string | number;
  deliveryAddress: string;
  deliveryLat: string | number;
  deliveryLng: string | number;
  promoCodeId?: number | null;
  paymentId?: number | null;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  updatedBy?: number | null;
}

export type LocationType = 'HOME' | 'WORK' | 'OTHER' | 'VENDOR';
export interface LocationAttributes {
  id?: number;
  userId?: number | null;
  vendorId?: number | null;
  address: string;
  latitude: string | number;
  longitude: string | number;
  type: LocationType;
}

export type PromoCodeDiscountType = 'PERCENTAGE' | 'FLAT';
export interface PromoCodeAttributes {
  id?: number;
  title?: string | null;
  vendorId: number;
  code: string;
  discountType: PromoCodeDiscountType;
  discountValue: string | number;
  maxUsage?: number | null;
  minimumOrderValue?: string | number | null;
  expiresAt?: Date | null;
  isActive?: boolean;
  isDeleted?: boolean;
}

export interface ChatAttributes {
  id?: number;
  orderId: number;
  senderId: number;
  receiverId: number;
  message: string;
  sentAt: Date;
}

export interface WalletAttributes {
  id?: number;
  userId: number;
  balance: string | number;
  lastCashout?: Date | null;
}

export type PaymentMethod = 'Vodafone' | 'AirtelGo' | 'MTN' | 'Card' | 'Cash';
export type PaymentStatus = 'Pending' | 'Completed' | 'Failed';

export interface PaymentAttributes {
  id?: number;
  userId: number;
  orderId: number;
  amount: string | number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionRef?: string | null;
  paidAt?: Date | null;
}
export type UserType = 'CUSTOMER' | 'VENDOR' | 'RIDER' | 'ADMIN';
export type UserRoleType = 'ADMIN' | 'CUSTOMER' | 'VENDOR' | 'RIDER';
export type DocumentType = 'GhanaCard' | 'Passport' | 'NationalID';

export interface UsersAttributes {
  id?: number;
  firstName: string;
  lastName: string;
  countryCode: string;
  phoneNumber: string;
  otp?: Date;
  type: UserType;
  otpExpiry?: Date;
  roleId?: number | null;
  branchId?: number;
  cnic?: string;
  drivingLicence?: string;
  rejectionReason?: string;
  age?: number;
  email: string;
  status: string;
  firstPageVisited: string;
  password?: string;
  profilePic?: string | null;
  designation?: string | null;
  roleType?: UserRoleType | null;
  // New fields for delivery app
  facePhoto?: string | null;
  idDocumentPhoto?: string | null;
  documentType?: DocumentType | null;
  walletBalance?: string | number | null;
  country?: string;
  language?: string;
  timezone?: string;
  nickname?: string;
  gender?: string;
  isActive?: boolean;
  isEmailVerify?: boolean;
  createdBy?: string | null;
  updatedBy?: string | null;
  isDeleted?: boolean;
  deletedBy?: string | null;
  deletedAt?: Date | null;
}

export interface IModules {
  id?: number;
  hasChild: boolean;
  label: string;
  icon: string;
  url: string;
  order: number;
  status?: string;
  createdBy?: number;
  updatedBy?: number;
  isDeleted?: boolean;
  deletedBy?: number;
  deletedAt?: Date;
}

export interface IPages {
  id?: number | number[];
  label: string;
  icon: string;
  url: string;
  order: number
  moduleId: number;
  isDeleted: boolean;
  createdBy: string | null;
  updatedBy: string | null;
  deletedBy: string;
  deletedAt: Date | null;
}

export interface IPermissions {
  id?: number;
  userId?: number;
  rolePageId: number;
  actionId: number;
}


export interface IRoles {
  id?: number;
  name: string;
  description: string;
  type: string;
  isDeleted: boolean;
  createdBy: string | null;
  updatedBy: string | null;
  deletedBy: string;
  deletedAt: Date | null;
}

export interface IAuditLogs {
  id?: number;
  action: string;
  cpNumber?: string;
  payload: string;
  userId: number
  isDeleted: boolean | null
  createdBy: string | null;
  updatedBy: string | null;
  deletedBy: string;
  deletedAt: Date | null;
}

export interface INotifications {
  id?: number;
  type?: string;
  sender?: string;
  to?: string | null;
  cc?: string[] | null;
  bcc?: string[] | null;
  success?: boolean;
  error?: object | null;
  isDeleted?: boolean
  isRead?: boolean;
  auditLogId?: number | null;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
  deletedAt?: Date;
}

export interface IRolePage {
  id?: number;
  roleId: number;
  pageId: number
}

export interface PageParams {
  pageNumber?: number;
  pageSize?: number
}


export interface IActions {
  id?: number | number[];
  // name: string;
  isDeleted: boolean;
  createdBy: string | null;
  updatedBy: string | null;
  deletedBy: string;
  deletedAt: Date | null;
}

export interface WaitlistAttributes {
  id?: number;
  name: string;
  phoneNumber: string | number;
  email: string;
  isAdult?: boolean;
  type: 'RIDER' | 'VENDOR' | 'CUSTOMER';
}

export interface UploadsAttributes {
  id?: number;
  fileHash: string;
  originalName: string;
  filePath: string;
  size: string | number;
  createdAt?: Date;
  updatedAt?: Date;
}