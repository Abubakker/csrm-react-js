export function timeout(ms: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('Done waiting');
      resolve(ms);
    }, ms);
  });
}

/** 千分位 */
export function thousands(data?: number | string, toFixed = 0) {
  if(data === 0 || data === '0') return 0;
  if (!data) return '';
  // 根据 toFixed 决定是否保留小数位
  const formattedNumber =
    toFixed === 0 ? Number(data).toFixed(0) : Number(data).toFixed(toFixed);
  // 使用正则表达式添加千分位分隔符
  return formattedNumber.replace(/\d(?=(\d{3})+(?!\d))/g, '$&,');
}
