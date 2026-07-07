import dotenv from 'dotenv';
dotenv.config();
const required = ['MONGO_URI', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];
for (const key of required) {
  if (!process.env[key]) console.warn(`[env] Missing ${key}; set it before production use.`);
}
export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nimcet',
  accessSecret: process.env.JWT_ACCESS_SECRET || 'dev-access-secret',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
  accessTtl: process.env.ACCESS_TOKEN_TTL || '15m',
  refreshDays: Number(process.env.REFRESH_TOKEN_TTL_DAYS || 30),
  cookieDomain: process.env.COOKIE_DOMAIN,
  mailFrom: process.env.MAIL_FROM || 'NIMCET Exams <no-reply@example.com>',
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  isProd: process.env.NODE_ENV === 'production',
};
