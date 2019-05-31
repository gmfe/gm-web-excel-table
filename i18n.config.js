let config = {
  resourceDir: 'resource',
  outputDir: 'out',
  // 下面是双语替换排除的路径
  callStatement: 'i18next.t',
  exclude: ['src/story/refund_excel/i18next.js'],
  importStatementStr: "import {i18next} from 'gm-i18n';\n"
}

module.exports = config
