import { DataTypes, Model } from 'sequelize';
import SequelizeClass from '../../settings/orm/sequelize';
import { VendorAttributes } from './interfaces';
const sequelize = SequelizeClass.getInstance().sequelize;

class Vendor extends Model<VendorAttributes> { }

Vendor.init({
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  userId: { 
    type: DataTypes.INTEGER, 
    // allowNull: false, 
    // references: { model: 'users', key: 'id' } 
  },
  businessName: { 
    type: DataTypes.STRING 
  },
  businessType: { 
    type: DataTypes.ENUM('RESTAURANT', 'GROCERY', 'RETAIL', 'BEAUTY', 'PET', 'OTHER') 
  },
  address: { 
    type: DataTypes.STRING 
  },
  isActive: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  },
}, {
  sequelize,
  tableName: 'vendors',
  timestamps: false,
});

export default Vendor;
