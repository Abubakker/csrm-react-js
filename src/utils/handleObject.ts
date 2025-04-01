/** 千分位 */
export const Thousands = (num: number | string): string => {
  let reg = /\B(?=(\d{3})+$)/g;
  return String(num).replace(reg, ',');
};

/** , 替换成 空格 */
export const ReplaceAll = (
  data: string,
  oldPlaceholder: string = ',',
  newPlaceholder: string = ' '
): string => {
  if (data) {
    // 从ECMAScript 2021规范开始，JavaScript原生支持了replaceAll()方法
    return data.replaceAll(oldPlaceholder, newPlaceholder);
  }
  return data;
};
