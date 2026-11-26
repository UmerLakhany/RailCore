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

export interface VendorAddressAttributes {
  address_id?: number;
  vendor_id: number;
  address: string;
  latitude: string;
  longitude: string;
  label?: string;
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