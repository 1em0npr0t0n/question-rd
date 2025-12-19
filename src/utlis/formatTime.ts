export function formatTimestamp(
  timestamp: number,
  format: string = 'YYYY-MM-DD HH:mm:ss',
): string {
  const date = new Date(timestamp);

  // 定义一个替换对象，将格式令牌映射为对应的日期部分
  const replacements: { [key: string]: string } = {
    YYYY: String(date.getFullYear()),
    MM: String(date.getMonth() + 1).padStart(2, '0'),
    DD: String(date.getDate()).padStart(2, '0'),
    HH: String(date.getHours()).padStart(2, '0'),
    mm: String(date.getMinutes()).padStart(2, '0'),
    ss: String(date.getSeconds()).padStart(2, '0'),
  };

  // 使用正则表达式替换格式字符串中的令牌
  return format.replace(/YYYY|MM|DD|HH|mm|ss/g, (match) => replacements[match]);
}
