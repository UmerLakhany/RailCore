import { Sequelize } from 'sequelize';

/**
 * Single shared Sequelize (PostgreSQL) instance.
 * Models import `sequelize` from here; `connectDatabase()` is called once on boot.
 */
class SequelizeClass {
  private static instance: SequelizeClass | null = null;
  public readonly sequelize: Sequelize;

  private constructor() {
    const dbUrl = process.env.DB_URL;
    if (!dbUrl) {
      throw new Error('DB_URL environment variable is not defined.');
    }

    this.sequelize = new Sequelize(dbUrl, {
      dialect: 'postgres',
      logging: process.env.DB_LOGGING === 'true' ? console.log : false,
      pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
    });
  }

  public static getInstance(): SequelizeClass {
    if (!SequelizeClass.instance) {
      SequelizeClass.instance = new SequelizeClass();
    }
    return SequelizeClass.instance;
  }

  public close(): Promise<void> {
    return this.sequelize.close();
  }
}

/**
 * Verifies the connection and creates missing tables.
 * NOTE: `sync` is a bootstrap convenience; switch to sequelize-cli migrations
 * before production data exists. `DB_SYNC_ALTER=true` alters existing tables (dev only).
 */
export async function connectDatabase(retries = 10, delayMs = 3000): Promise<void> {
  const { sequelize } = SequelizeClass.getInstance();

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await sequelize.authenticate();
      console.log('Database connection established.');
      break;
    } catch (err: any) {
      console.error(`Database connection failed (attempt ${attempt}/${retries}): ${err.message}`);
      if (attempt === retries) throw err;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  await sequelize.sync({ alter: process.env.DB_SYNC_ALTER === 'true' });
  console.log('Database models synchronized.');
}

export default SequelizeClass;
