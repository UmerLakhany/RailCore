import { DataTypes, Model } from 'sequelize';
import SequelizeClass from '../../settings/orm/sequelize';
import { CustomerAttributes } from './interfaces';
const sequelize = SequelizeClass.getInstance().sequelize;

class Customer extends Model<CustomerAttributes> { }

Customer.init({
  customer_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    // allowNull: false,
    // references: {
    //   model: 'users',
    //   key: 'id'
    // }
  },
  phone: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING
  },
  created_at: {
    type: DataTypes.DATE
  },
  updated_at: {
    type: DataTypes.DATE
  },
}, {
  sequelize,
  tableName: 'customers',
  timestamps: false,
});

export default Customer;
