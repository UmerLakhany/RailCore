import { DataTypes, Model } from 'sequelize';
import SequelizeClass from '../../settings/orm/sequelize';
import { UsersAttributes } from './interfaces';
const sequelize = SequelizeClass.getInstance().sequelize;

class User extends Model<UsersAttributes> { }

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  language: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  timezone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  nickname: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM('CUSTOMER', 'VENDOR', 'RIDER', 'ADMIN'),
    allowNull: false
  },
  cnic: {
    type: DataTypes.STRING,
    allowNull: true
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  countryCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  profilePic: {
    type: DataTypes.STRING,
  },
  roleType: {
    type: DataTypes.ENUM('ADMIN', 'CUSTOMER', 'VENDOR', 'RIDER'),
    allowNull: true
  },
  // For face/photo verification and documents
  facePhoto: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  idDocumentPhoto: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  documentType: {
    type: DataTypes.ENUM('GhanaCard', 'Passport', 'NationalID'),
    allowNull: true,
  },
  walletBalance: {
    type: DataTypes.DECIMAL(12,2),
    allowNull: true,
    defaultValue: 0.00,
  },
  firstPageVisited: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'dashboard',
  },
  status: {
    type: DataTypes.ENUM('Approved', 'Rejected', 'Pending'),
    defaultValue: 'Pending',
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  isEmailVerify: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  rejectionReason: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  updatedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  deletedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  deletedAt: {
    type: DataTypes.DATE,
  },
}, {
  sequelize,
  tableName: 'users',
  indexes: [
    {
      unique: true,
      fields: ['email'],
    }
  ]
});

export default User;