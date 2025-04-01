import { DefaultOptionType } from 'types/base';

const getCascaderFilter = (inputValue: string, path: DefaultOptionType[]) => {
  return path.some((option) => {
    // 将特殊字符替换为空格，并去除多余空格
    const sanitizedLabel = (option.label as string)
      .replace(/[-/&]/g, ' ') // 替换特殊字符为空格
      .replace(/\s+/g, ' ') // 将多个空格替换为单个空格
      .trim() // 去除字符串首尾的空格
      .toLowerCase();

    // 将输入的字符串处理成可以匹配的格式
    const sanitizedInput = inputValue
      .replace(/[-/&]/g, ' ') // 替换特殊字符为空格
      .replace(/\s+/g, ' ') // 将多个空格替换为单个空格
      .trim() // 去除字符串首尾的空格
      .split('') // 将字符串分割成字符数组
      .join('.*') // 在每个字符间插入 '.*' 以匹配任意字符
      .toLowerCase();

    const regex = new RegExp(sanitizedInput); // 创建一个正则表达式进行匹配

    // 使用正则表达式进行匹配
    return regex.test(sanitizedLabel);
  });
};

export default getCascaderFilter;
