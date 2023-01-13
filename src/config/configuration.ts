export default () => ({
  port: parseInt(process.env.PORT, 10) || 8000,
  database: {
    type: process.env.DATABASE_TYPE || 'postgres',
    url: process.env.DATABASE_URL || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USER || 'student',
    password: process.env.DATABASE_PASSWORD || 'student',
    database: process.env.DATABASE_NAME || 'kupipodariday',
    entities: ['src/**/**.entity{.ts,.js}'],
    synchronize: true,
  },
});