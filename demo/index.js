import Vue from "vue";
import VueCountryCode from "../src/index";
import App from "./App.vue";

Vue.use(VueCountryCode);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({ ...App }).$mount("#app");
