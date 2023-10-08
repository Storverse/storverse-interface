import { createApp, ref ,computed} from "vue";

import App from "./App.vue";
import router from "./router";
import Web3 from "web3";
// pinia store
import pinia from "@/store/index";
import { reHandle } from "./hooks/useHandle";

let web3 = ref() as any;

// element plus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
// css
import "../src/styles/common.scss";
import "../src/styles/reset.scss";
import "../src/styles/font.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
//handle wallet
import { initService, getNotifications, saveReadNotifications } from "@/libs/notification";
import wallet from "@/utils/wallet.js";
reHandle();

//i18n
import i18n from "./lang/index";
const app = createApp(App);
app.provide("$wallet", wallet);
app.config.globalProperties.$Web3 = web3;
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(router).use(pinia);
app.use(ElementPlus);
app.use(i18n);
app.mount("#app");
