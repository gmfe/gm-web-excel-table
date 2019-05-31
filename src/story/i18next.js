import { i18nextInit, getDefaultLng } from 'gm-i18n'
import { setLocale } from 'react-gm/src/locales'
import { setLocale as setUtilLocale } from 'gm-util'
import locales from './locales'

const config = {
  debug: false,
  resources: {
    'zh': {
      default: locales.zh
    },
    'en': {
      default: locales.en
    }
  }
}
// 初始化i18next
i18nextInit(config)

// 初始化 react-gm 和 gm-util 的语言
const lng = getDefaultLng()
setLocale(lng)
setUtilLocale(lng)
