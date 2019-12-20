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
export default {
  name: "app",
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
