import { DataTypes, Model } from 'sequelize';
import SequelizeClass from '../../settings/orm/sequelize';
import { OtpAttributes } from './interfaces';
const sequelize = SequelizeClass.getInstance().sequelize;

class OTP extends Model<OtpAttributes> {}

OTP.init({
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  otp: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  email: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  phoneNumber: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
  type: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
  expiresAt: { 
    type: DataTypes.DATE, 
    allowNull: true 
  },
  isUsed: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false 
  },
}, {
  sequelize,
  tableName: 'otps',
  timestamps: false,
});

export default OTP;
