import { utils, writeFile } from 'xlsx';

function exportToExcel(
  sheets: { sheetName: string; data: any[][] }[],
  filename: string = 'export.xlsx'
) {
  // 创建一个工作簿
  const workbook = utils.book_new();

  // 遍历每个 Sheet 并添加到工作簿中
  sheets.forEach(({ sheetName, data }) => {
    const worksheet = utils.aoa_to_sheet(data); // 将二维数组转换为工作表
    utils.book_append_sheet(workbook, worksheet, sheetName); // 添加工作表到工作簿
  });

  // 导出文件
  writeFile(workbook, filename);
}

export default exportToExcel;
