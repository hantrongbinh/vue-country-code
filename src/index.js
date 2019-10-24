import VueCountryCode from './VueCountryCode.vue';

export default {
  ...VueCountryCode,
  install: (Vue) => {
    Vue.component(VueCountryCode.name, VueCountryCode);
    return Vue;
  },
};