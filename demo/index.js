import Vue from 'vue';
import VueCountryCode from '../dist/vue-country-code';

import '../dist/vue-country-code.css';

import App from './App.vue';

Vue.use(VueCountryCode);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({ ...App }).$mount('#app');