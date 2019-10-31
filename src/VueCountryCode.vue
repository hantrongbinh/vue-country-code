<template>
  <div class="vue-country-select" :class="{ disabled: disabled }">
    <div
      class="dropdown"
      @click="toggleDropdown"
      v-click-outside="clickedOutside"
      :class="{ open: open }"
      @keydown="keyboardNav"
      tabindex="0"
      @keydown.esc="reset"
    >
      <span class="current">
        <div
          v-if="enabledFlags"
          class="iti-flag"
          :class="activeCountry.iso2.toLowerCase()"
        ></div>
        <span v-if="enabledCountryCode" class="country-code"
          >+{{ activeCountry.dialCode }}</span
        >
        <span class="dropdown-arrow">{{ open ? "▲" : "▼" }}</span>
      </span>
      <ul v-show="open" ref="list" class="dropdown-list">
        <li
          class="dropdown-item"
          v-for="(pb, index) in sortedCountries"
          :key="pb.iso2 + (pb.preferred ? '-preferred' : '')"
          @click="choose(pb)"
          :class="getItemClass(index, pb.iso2)"
          @mousemove="selectedIndex = index"
        >
          <div
            class="iti-flag"
            v-if="enabledFlags"
            :class="pb.iso2.toLowerCase()"
          ></div>
          <strong>{{ pb.name }}</strong>
          <span v-if="dropdownOptions && !dropdownOptions.disabledDialCode"
            >+{{ pb.dialCode }}</span
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
@import url("./assets/sprite.css");
.vue-country-select {
  border-radius: 3px;
  display: inline-block;
  border: 1px solid #bbb;
  text-align: left;
  &:focus-within {
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
      0 0 8px rgba(102, 175, 233, 0.6);
    border-color: #66afe9;
  }
  .dropdown {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 0.5em;
    position: relative;
    cursor: pointer;
    &.open {
      background-color: #f3f3f3;
    }
    &:hover {
      background-color: #f3f3f3;
    }
  }
  .dropdown-list {
    z-index: 1;
    padding: 0;
    margin: 0;
    text-align: left;
    list-style: none;
    max-height: 200px;
    overflow-y: scroll;
    position: absolute;
    top: 100%;
    left: -1px;
    background-color: #fff;
    border: 1px solid #ccc;
    width: 390px;
  }
  .dropdown-item {
    cursor: pointer;
    padding: 4px 15px;
    .iti-flag {
      display: inline-block;
      margin-right: 5px;
      margin-left: 5px;
    }
    &.highlighted {
      background-color: #f3f3f3;
    }
    &.last-preferred {
      border-bottom: 1px solid #cacaca;
    }
  }
  .dropdown-arrow {
    transform: scaleY(0.5);
    display: inline-block;
    color: #666;
  }
  .current {
    font-size: 0.8em;
    display: flex;
    align-items: center;
  }

  .country-code {
    color: #666;
  }
}
.vue-country-select.disabled .current,
.vue-country-select.disabled .dropdown {
  cursor: no-drop;
}
</style>

<script>
import allCountries from "./allCountries";
import getCountry from "./defaultCountry";

export default {
  name: "vue-country-code",
  props: {
    disabledFetchingCountry: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    disabledFormatting: {
      type: Boolean,
      default: false
    },
    defaultCountry: {
      // Default country code, ie: 'AU'
      // Will override the current country of user
      type: String,
      default: ""
    },
    enabledCountryCode: {
      type: Boolean,
      default: false
    },
    enabledFlags: {
      type: Boolean,
      default: true
    },
    preferredCountries: {
      type: Array,
      default: () => []
    },
    onlyCountries: {
      type: Array,
      default: () => []
    },
    ignoredCountries: {
      type: Array,
      default: () => []
    },
    dropdownOptions: {
      type: Object,
      default: () => ({})
    },
    selectedCountryCode: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.initializeCountry();
    this.$emit("onSelect", this.activeCountry);
  },
  data() {
    return {
      activeCountry: { iso2: "" },
      open: false,
      selectedIndex: null,
      typeToFindInput: "",
      typeToFindTimer: null
    };
  },
  computed: {
    filteredCountries() {
      // List countries after filtered
      if (this.onlyCountries.length) {
        return this.getCountries(this.onlyCountries);
      }

      if (this.ignoredCountries.length) {
        return allCountries.filter(
          ({ iso2 }) =>
            !this.ignoredCountries.includes(iso2.toUpperCase()) &&
            !this.ignoredCountries.includes(iso2.toLowerCase())
        );
      }

      return allCountries;
    },
    sortedCountries() {
      // Sort the list countries: from preferred countries to all countries
      const preferredCountries = this.getCountries(
        this.preferredCountries
      ).map(country => ({ ...country, preferred: true }));

      return [...preferredCountries, ...this.filteredCountries];
    }
  },
  methods: {
    initializeCountry() {
      /**
       * 1. Use default country if passed from parent
       */
      if (this.defaultCountry) {
        const defaultCountry = this.findCountry(this.defaultCountry);
        if (defaultCountry) {
          this.activeCountry = defaultCountry;
          return;
        }
      }
      /**
       * 2. Use the first country from preferred list (if available) or all countries list
       */
      this.activeCountry =
        this.findCountry(this.preferredCountries[0]) ||
        this.filteredCountries[0];
      /**
       * 3. Check if fetching country based on user's IP is allowed, set it as the default country
       */
      if (!this.disabledFetchingCountry) {
        getCountry().then(res => {
          this.activeCountry = this.findCountry(res) || this.activeCountry;
        });
      }
    },
    /**
     * Get the list of countries from the list of iso2 code
     */
    getCountries(list = []) {
      return list
        .map(countryCode => this.findCountry(countryCode))
        .filter(Boolean);
    },
    findCountry(iso = "") {
      return allCountries.find(country => country.iso2 === iso.toUpperCase());
    },
    getItemClass(index, iso2) {
      const highlighted = this.selectedIndex === index;
      const lastPreferred = index === this.preferredCountries.length - 1;
      const preferred = !!~this.preferredCountries
        .map(c => c.toUpperCase())
        .indexOf(iso2);
      return {
        highlighted,
        "last-preferred": lastPreferred,
        preferred
      };
    },
    choose(country) {
      this.activeCountry = country;
      this.$emit("onSelect", this.activeCountry);
    },
    toggleDropdown() {
      if (this.disabled) {
        return;
      }
      this.open = !this.open;
    },
    clickedOutside() {
      this.open = false;
    },
    keyboardNav(e) {
      if (e.keyCode === 40) {
        // down arrow
        this.open = true;
        if (this.selectedIndex === null) {
          this.selectedIndex = 0;
        } else {
          this.selectedIndex = Math.min(
            this.sortedCountries.length - 1,
            this.selectedIndex + 1
          );
        }
        let selEle = this.$refs.list.children[this.selectedIndex];
        if (
          selEle.offsetTop + selEle.clientHeight >
          this.$refs.list.scrollTop + this.$refs.list.clientHeight
        )
          this.$refs.list.scrollTop =
            selEle.offsetTop -
            this.$refs.list.clientHeight +
            selEle.clientHeight;
      } else if (e.keyCode === 38) {
        // up arrow
        this.open = true;
        if (this.selectedIndex === null) {
          this.selectedIndex = this.sortedCountries.length - 1;
        } else {
          this.selectedIndex = Math.max(0, this.selectedIndex - 1);
        }
        let selEle = this.$refs.list.children[this.selectedIndex];
        if (selEle.offsetTop < this.$refs.list.scrollTop)
          this.$refs.list.scrollTop = selEle.offsetTop;
      } else if (e.keyCode === 13) {
        // enter key
        if (this.selectedIndex !== null) {
          this.choose(this.sortedCountries[this.selectedIndex]);
        }
        this.open = !this.open;
      } else {
        // typing a country's name
        this.typeToFindInput += e.key;
        clearTimeout(this.typeToFindTimer);
        this.typeToFindTimer = setTimeout(() => {
          this.typeToFindInput = "";
        }, 700);
        // don't include preferred countries so we jump to the right place in the alphabet
        let typedCountryI = this.sortedCountries
          .slice(this.preferredCountries.length)
          .findIndex(c =>
            c.name.toLowerCase().startsWith(this.typeToFindInput)
          );
        if (~typedCountryI) {
          this.selectedIndex = this.preferredCountries.length + typedCountryI;
          let selEle = this.$refs.list.children[this.selectedIndex];
          if (
            selEle.offsetTop < this.$refs.list.scrollTop ||
            selEle.offsetTop + selEle.clientHeight >
              this.$refs.list.scrollTop + this.$refs.list.clientHeight
          ) {
            this.$refs.list.scrollTop =
              selEle.offsetTop - this.$refs.list.clientHeight / 2;
          }
        }
      }
    },
    reset() {
      this.selectedIndex = this.sortedCountries
        .map(c => c.iso2)
        .indexOf(this.activeCountry.iso2);
      this.open = false;
    }
  },
  directives: {
    // Click-outside from BosNaufal: https://github.com/BosNaufal/vue-click-outside
    "click-outside": {
      bind: function(el, binding, vNode) {
        // Provided expression must evaluate to a function.
        if (typeof binding.value !== "function") {
          var compName = vNode.context.name;
          var warn =
            "[Vue-click-outside:] provided expression " +
            binding.expression +
            " is not a function, but has to be";
          if (compName) {
            warn += "Found in component " + compName;
          }
          console.warn(warn);
        }
        // Define Handler and cache it on the element
        var bubble = binding.modifiers.bubble;
        var handler = function(e) {
          if (bubble || (!el.contains(e.target) && el !== e.target)) {
            binding.value(e);
          }
        };
        el.__vueClickOutside__ = handler;
        // add Event Listeners
        document.addEventListener("click", handler);
      },
      unbind: function(el, binding) {
        // Remove Event Listeners
        document.removeEventListener("click", el.__vueClickOutside__);
        el.__vueClickOutside__ = null;
      }
    }
  }
};
</script>
