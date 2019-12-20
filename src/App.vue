<template>
  <div id="app">
    <h1>Telephone Country Select</h1>
    <h2 style="color: #999">made with &#x2764; by Mon.</h2>
    <div style="margin: 20px auto;">
      <vue-country-code
        @onSelect="onSelect"
        :preferredCountries="['vn', 'us', 'gb']"
        defaultCountry=""
      ></vue-country-code>
    </div>
    <div>
      <code>{{ selectedCountry }}</code>
    </div>
  </div>
</template>

<script>
import VueCountryCode from "./components/VueCountryCode";
export default {
  name: "app",
  components: {
    VueCountryCode
  },
  data() {
    return {
      selectedCountry: null
    };
  },
  methods: {
    onSelect(data) {
      this.selectedCountry = data;
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
