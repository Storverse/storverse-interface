import { createI18n } from 'vue-i18n'


import elementEnLocale from 'element-plus/lib/locale/lang/en'
import elementZhLocale from 'element-plus/lib/locale/lang/zh-cn'


import enLocale from './en'
import zhLocale from './zh'


const messages = {
  en:{
    ...enLocale,
    ...elementEnLocale
  },
  'zh-cn':{
    ...zhLocale,
    elementZhLocale
  }
}


const i18n = createI18n({
  legacy: false,
  globalInjection:true,  
  locale: 'en',
  messages: messages
})

export default i18n
