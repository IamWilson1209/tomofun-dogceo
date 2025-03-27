import { z } from 'zod';

export const searchSchema = z
  .string()
  .min(0).max(30, { message: 'Search query must be 30 characters or less' }) // 輸入最大長度為 30 字，應該沒有狗名字這麼長
  .refine((value) => !/^\d+$/.test(value), { // 禁止純數字
    message: 'Search query cannot be a number',
  })