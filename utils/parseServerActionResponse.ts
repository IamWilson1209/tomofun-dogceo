/* 將回傳的任何形式的 response 轉換成 JavaScript 可用的物件 */
export function parseServerActionResponse<T>(response: T) {
  return JSON.parse(JSON.stringify(response))
}