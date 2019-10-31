# vue-country-code

Country Code Select with Vue.

Checkout Demo at [Github pages](https://hantrongbinh.github.io/vue-country-code/).

## Installation

- **yarn**:
  ```bash
    yarn add vue-country-code
  ```
- **npm**:
  ```bash
    npm i --save vue-country-code
  ```

## Usage

- Import default `CSS` to your project:

  ```js
  import "vue-country-code/dist/vue-country-code.css";
  ```

- Install as a global component:

  ```javascript
  import Vue from "vue";
  import VueCountryCode from "vue-country-code";

  Vue.use(VueCountryCode);
  ```

- In your component:

  ```js
  <template>
  ...
     <vue-country-code
                    @onSelect="onSelect"
                    <!-- optional -->
                    :preferredCountries="['vn', 'us', 'gb']">
     </vue-country-code>
  ...
  <template>
  <script>
  export default {
    data() {
      return {
      };
    },
    methods: {
       onSelect({name, iso2, dialCode}) {
         console.log(name, iso2, dialCode);
       },
    },
  }
  </script>
  ```

- Register the new field as a global component

### Props

| Property value            | Type      | Default value                 | Description                                                                 |
| ------------------------- | --------- | ----------------------------- | --------------------------------------------------------------------------- |
| `defaultCountry`          | `string`  | `''`                          | Default country, will override the country fetched from IP address of user  |
| `disabledFetchingCountry` | `Boolean` | false                         | Disable fetching current country based on IP address of user                |
| `enabledCountryCode`      | `Boolean` | `false`                       | Enable country code in the input                                            |
| `enabledFlags`            | `Boolean` | `true`                        | Enable flags in the input                                                   |
| `preferredCountries`      | `Array`   | `[]`                          | Preferred countries list, will be on top of the dropdown. ie `['AU', 'BR']` |
| `onlyCountries`           | `Array`   | `[]`                          | List of countries will be shown on the dropdown. ie `['AU', 'BR']`          |
| `ignoredCountries`        | `Array`   | `[]`                          | List of countries will NOT be shown on the dropdown. ie `['AU', 'BR']`      |
| `dropdownOptions`         | `Object`  | `{ disabledDialCode: false }` | Options for dropdown, supporting `disabledDialCode`                         |

### Events

| Property value | Arguments | Description                                                                                      |
| -------------- | --------- | ------------------------------------------------------------------------------------------------ |
| `onSelect`     | `Object`  | Fires when the input changes with the argument is the object includes `{ name, iso2, dialCode }` |

## Highlights & Credits

- Forked from [EducationLink/vue-tel-input](https://github.com/EducationLink/vue-tel-input).
- Vue app created by [vue-cli](https://github.com/vuejs/vue-cli).
- Telephone Number parsing, validation by [libphonenumber-js](https://catamphetamine.github.io/libphonenumber-js/).
- Country Codes data from [intl-tel-input](https://github.com/jackocnr/intl-tel-input/blob/master/src/js/data.js).
- Country Flags by [behdad/region-flags](https://github.com/behdad/region-flags).
- User's Location by [get-json](https://www.npmjs.com/package/get-json) and [ipifo.io](https://ipinfo.io/json)

## Demo Usage

```bash

# install dependencies
$ yarn/npm install

# compile demo and start serve for development
$ yarn/npm dev

# build
$ yarn/npm build

```

Made by [Mon](https://github.com/hantrongbinh).
