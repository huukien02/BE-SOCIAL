import * as path from 'path';
import * as fs from 'fs';

export const ROLE = {
  USER: 'user',
  ADMIN: 'admin',
};

export const AUTH_SECCET_KEY = 'AUTH_SECCET_KEY';
export const TIME_EXPIRE = '1h';
export const dateTimeExpire = () => {
  return new Date(Date.now() + 3600 * 1000);
};

export interface ApiResponse {
  message: string;
  statusCode: number;
  data?: any;
}

export const saveFile = (file: any, folder: 'avatar' | 'blogs'): string => {
  const uploadDir = path.join(__dirname, '../../', `images/${folder}`);
  const baseUrl = `http://localhost:4000/images/${folder}/`;
  const fileName = `${folder}_${Date.now()}${path.extname(file?.originalname)}`;

  const filePath = path.join(uploadDir, fileName);
  fs.writeFileSync(filePath, file.buffer);

  return `${baseUrl}${fileName}`;
};

