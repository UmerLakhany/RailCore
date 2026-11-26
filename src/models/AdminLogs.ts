import { DataTypes, Model } from 'sequelize';
import SequelizeClass from '../../settings/orm/sequelize';
import { AdminLogAttributes } from './interfaces';
const sequelize = SequelizeClass.getInstance().sequelize;

class AdminLog extends Model<AdminLogAttributes> { }

AdminLog.init({
  log_id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  admin_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    // references: { model: 'users', key: 'id' } 
  },
  action: { type: DataTypes.STRING },
  details: { type: DataTypes.STRING },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  sequelize,
  tableName: 'admin_logs',
  timestamps: false,
});

export default AdminLog;
