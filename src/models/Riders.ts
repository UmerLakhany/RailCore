import { DataTypes, Model } from 'sequelize';
import SequelizeClass from '../../settings/orm/sequelize';
import { RiderAttributes } from './interfaces';
const sequelize = SequelizeClass.getInstance().sequelize;

class Rider extends Model<RiderAttributes> { }

Rider.init({
  rider_id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  user_id: { 
    type: DataTypes.INTEGER, 
    // allowNull: false, 
    // references: { model: 'users', key: 'id' } 
  },

  drivingLicence: {
    type: DataTypes.STRING,
    allowNull: true
  },
  
  vehicle_number: { 
    type: DataTypes.STRING,
    allowNull: true
  },
  is_active: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  },
}, {
  sequelize,
  tableName: 'riders',
  timestamps: false,
});

export default Rider;
