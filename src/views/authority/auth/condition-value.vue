<template>
  <component :is="component.name" v-if="excludeList.includes(component.name)" v-model="value" placeholder="请输入" v-bind="component.props" v-on="componentEvents()" />
  <component :is="component.name" v-else :value="value" v-bind="component.props" v-on="componentEvents()" />
</template>

<script>
import { isArray, isObject } from "@monkey.do/monkey";

export default {
  name: "ConditionValue",
  props: {
    form: {
      type: Object,
      default: () => ({}),
    },
    prop: {
      type: String,
      default: "",
    },
    formatter: {
      type: Function,
      default: (value) => value,
    },
    provideCustomData: {
      type: null,
      default: "",
    },
    scope: {
      type: Object,
      default: null,
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  inject: {
    elForm: {
      default: null,
    },
  },
  data() {
    return {
      authObjects: [],
      code: '',
      conditionValue: undefined,
      excludeList: ["el-input", "textarea"],
    };
  },
  computed: {
    component() {
      const props = {
        "member": {
          name: "member-selector",
          props: {
            multiple: this.isMultiple,
            wants: "",
            formatter: (data) => {
              const newArr = this.authObjects.concat(data);
              return newArr;
            },
          },
        },
        "dept": {
          name: "department-selector",
          props: {
            multiple: this.isMultiple,
            appendToBody: true,
            wants: "",
            showSearch: false,
            formatter: (data) => {
              const newArr = this.authObjects.concat(data);
              return newArr;
            },
          },
        },
        "dictionary": {
          name: "dictionary-selector",
          props: {
            appendToBody: true,
            wants: "",
            showSearch: false,
            code: this.code,
            value: this.conditionValue,
            property: {
              id: "id",
              name: "name",
            },
          },
        },
        "number": {
          name: "el-input",
          props: {
            value: this.form.value,
          },
        },
      };

      return props[this.getComponentByCode(this.getCode())] || {
        name: null,
        props: {},
      };
    },
    isMultiple() {
      if (this.getComponentByCode(this.getCode()) === "member" || this.getComponentByCode(this.getCode()) === "dept") {
        const arr = ["!=", "="];
        return !arr.includes(this.form.matchMode);
      }
      return false;
    },
    value: {
      get() {
        if (this.isMultiple) return this.form[this.prop] ? this.form[this.prop].split(",") : [];
        if (this.getComponentByCode(this.getCode()) === "member") {
          if (this.form[this.prop]) {
            return {
              id: this.form[this.prop],
              name: this.form["matchName"],
            };
          }
        }
        return this.form[this.prop];
      },
      set(val) {
        this.$set(this.form, this.prop, val);
      },
    },
  },
  watch: {
    form: {
      handler(val) {
        // 字典新增
        if (val.dictionaryCode) {
          this.code = val.dictionaryCode;
          this.conditionValue = val.value.name || '';
        }
        // 字典编辑
        if (val.sdField && val.sdField.dictionaryCode) {
          this.code = val.sdField.dictionaryCode;
          this.conditionValue = val.value || '';
        }
        // 成员和部门
        if (val.authObjects || val.sdField) {
          const authObjects = val.authObjects || val.sdField.authObjects;
          const code = val.entityTableCode || val.sdField.authModeCode;
          if (code === "member" && authObjects) {
            authObjects.forEach((item) => {
              const tempValue = {
                account: item.name,
                id: item.id,
                name: item.name,
                searchCode: "",
              };
              this.authObjects.push(tempValue);
              this.authObjects = this.unique(this.authObjects);
            });
          }
          if (code === "dept" && authObjects) {
            authObjects.forEach((item) => {
              const tempValue = {
                id: item.id,
                name: item.name,
              };
              this.authObjects.push(tempValue);
              this.authObjects = this.unique(this.authObjects);
            });
          }
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    getCode() {
      if (this.form.entityTableCode || this.form.authModeCode) {
        return this.form.entityTableCode || this.form.authModeCode;
      } else if (this.form.sdField) {
        return this.form.sdField.authModeCode;
      }
    },
    // isObject(o) {
    //   return !(o instanceof Array) && o instanceof Object;
    // },

    deWeight(arr) {
      const map = new Map();
      for (const item of arr) {
        if (!map.has(item.name)) {
          map.set(item.name, item);
        }
      }
      return [...map.values()];
    },
    unique(arr) {
      return [...new Set(arr)];
    },
    componentEvents() {
      return {
        change: (value) => {
          if (isObject(value) || isArray(value)) {
            if (this.isMultiple) {
              const ids = [];
              const names = [];

              value.forEach(item => {
                ids.push(item.id);
                names.push(item.name);
              });

              this.$set(this.form, this.prop, ids.join(","));
              this.$set(this.form, "matchName", names.join(",")); // TODO
            } else {
              this.$set(this.form, this.prop, value.id);
              this.$set(this.form, "matchName", value.name); // TODO
            }
          } else {
            this.$set(this.form, this.prop, value);
            this.$set(this.form, "matchName", value); // TODO
          }
          // if (this.$listeners.change) this.$listeners.change(this.form, this);
        },
      };
    },
    getComponentByCode(code) {
      const obj = {
        "dept": "dept",
        "member": "member",
        "dictionary": "dictionary",
        "number": "number",
      };
      return obj[code];
    },
  },
};
</script>
