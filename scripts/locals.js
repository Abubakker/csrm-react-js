// yarn add-i18n --name=home --value=主页

function generateRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const { Command } = require('commander');
const path = require('path');
const fs = require('fs');
const program = new Command();

const enLocalPath = path.resolve(__dirname, '../src/assets/locales/en.json');
const jaLocalPath = path.resolve(__dirname, '../src/assets/locales/ja.json');
const zhCNLocalPath = path.resolve(
  __dirname,
  '../src/assets/locales/zh_CN.json'
);
const zhTWLocalPath = path.resolve(
  __dirname,
  '../src/assets/locales/zh_TW.json'
);

const enIMLocalPath = path.resolve(
  __dirname,
  '../src/components/im-chat-admin-components/locales/en.json'
);
const jaIMLocalPath = path.resolve(
  __dirname,
  '../src/components/im-chat-admin-components/locales/ja.json'
);
const zhCNIMLocalPath = path.resolve(
  __dirname,
  '../src/components/im-chat-admin-components/locales/zh-CN.json'
);
const zhTWIMLocalPath = path.resolve(
  __dirname,
  '../src/components/im-chat-admin-components/locales/zh-TW.json'
);

const localesPath = path.resolve(__dirname, '../src/commons/locals.ts');

// 合并 JSON 文件
function mergeLocales(paths) {
  return paths.reduce((merged, filePath) => {
    if (fs.existsSync(filePath)) {
      const locale = require(filePath);
      return { ...merged, ...locale };
    } else {
      console.warn(`文件不存在: ${filePath}`);
      return merged;
    }
  }, {});
}

async function generateLocals(local) {
  const keys = Object.keys(local);

  let content = '';

  keys.forEach((key) => {
    content += `  '${key}': '${key}',\n`;
  });

  const output = `const LOCALS = {
${content}};

export default LOCALS;
`;

  await fs.writeFileSync(localesPath, output);
}

program
  .command('add')
  .description('add i18nKey')
  .option('--name <name>')
  .option('--value <value>')
  .action(async (options) => {
    const { value } = options;
    let { name } = options;

    if (!name) {
      name = generateRandomString(10);
      console.log(`name 随机生成 ${name}`);
    }

    // 合并所有路径的 JSON 文件
    const enLocal = require(enLocalPath);
    const jaLocal = require(jaLocalPath);
    const zhCNLocal = require(zhCNLocalPath);
    const zhTWLocal = require(zhTWLocalPath);

    if (
      Object.keys(enLocal).find((key) => key === name) ||
      Object.keys(jaLocal).find((key) => key === name) ||
      Object.keys(zhCNLocal).find((key) => key === name) ||
      Object.keys(zhTWLocal).find((key) => key === name)
    ) {
      console.error('name 已经存在');
      return;
    }

    const newEnLocal = { ...enLocal, [name]: value || '' };
    const newJaLocal = { ...jaLocal, [name]: value || '' };
    const newZhCNLocal = { ...zhCNLocal, [name]: value || '' };
    const newZhTWLocal = { ...zhTWLocal, [name]: value || '' };

    await fs.writeFileSync(
      enLocalPath,
      `${JSON.stringify(newEnLocal, 0, 2)}\n`
    );
    await fs.writeFileSync(
      jaLocalPath,
      `${JSON.stringify(newJaLocal, 0, 2)}\n`
    );
    await fs.writeFileSync(
      zhCNLocalPath,
      `${JSON.stringify(newZhCNLocal, 0, 2)}\n`
    );
    await fs.writeFileSync(
      zhTWLocalPath,
      `${JSON.stringify(newZhTWLocal, 0, 2)}\n`
    );

    await generateLocals({
      ...enLocal,
      [name]: value || '',
      ...require(enIMLocalPath),
    });

    console.log('创建成功');
  });

program
  .command('gen')
  .description('generate local.ts')
  .action(async () => {
    const enLocal = mergeLocales([enLocalPath, enIMLocalPath]);
    await generateLocals(enLocal);

    console.log('生成 local.ts 成功');
  });

program.parse();
