// api-response.interface.ts
export interface ApiResponse<T = any> {
  error: number;
  data: T;
  // 你还可以添加其他通用字段，如 message, timestamp 等
  // message?: string;
  // timestamp?: string;
}
