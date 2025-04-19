import * as dotenv from 'dotenv';
dotenv.config();
const constants = {
  secret: process.env.JWT_SECRET || 'STRONGKEY',
};

export default constants;
