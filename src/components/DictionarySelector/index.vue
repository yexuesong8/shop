<template>
  <ListSelector
    source-type="json"
    :json-data="dictionary"
    :wants="wants"
    :property="getProperty()"
    :disabled="disabled"
    :value="innerValue"
    :multiple="multiple"
    :placeholder="placeholder"
    :node-disabled="nodeDisabled"
    clearable
    @change="handleChange"
  />
</template>

<script>
import { ListSelector, isObject } from "@monkey.do/monkey";

export default {
  name: "DictionarySelector",
  components: { ListSelector },
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    code: {
      type: String,
      required: true,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: null,
      default: "",
    },
    parentCode: {
      type: String,
      default: "",
    },
    wants: {
      type: String,
      default: "content",
    },
    nodeDisabled: {
      type: [Function, Boolean],
      default: false,
    },
    placeholder: {
      type: String,
      default: "请选择",
    },
    showAll: {
      type: Boolean,
      default: false,
    },
    property: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      selectedValue: [],
      innerValue: "",
    };
  },
  computed: {
    dictionary() {
      const dictionary = this.$store.state["global"].dictionaryOption;
      let returnedDictionary = [];
      if (this.parentCode) {
        returnedDictionary = dictionary[this.code].filter(item => item.parentCode === this.parentCode);
      } else {
        returnedDictionary = dictionary[this.code];
      }

      if (this.showAll) {
        if (returnedDictionary.findIndex(item => item.code === 'dictionary_all') === -1) {
          returnedDictionary.unshift({
            code: "dictionary_all",
            content: "dictionary_all",
            dictionaryId: "1",
            id: "834427076541939712",
            name: "全部",
          });
        }
      }
      return returnedDictionary;
    },
  },
  watch: {
    value: {
      handler: function(value) {
        if (this.showAll && !this.value) {
          this.innerValue = "dictionary_all";
        } else {
          if (this.multiple) {
            this.innerValue = isObject(value) && !this.wants ? value[this.getProperty().id] : value;
          } else {
            this.innerValue = this.stringValue(isObject(value) && !this.wants ? value[this.getProperty().id] : value);
          }
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    handleChange(value, detail) {
      if (value === "dictionary_all") value = "";
      console.log(value, detail, 'value, detail');
      this.$emit("update:value", value, detail);
      this.$emit("change", value, detail);
    },
    getProperty() {
      return {
        id: 'content',
        name: 'name',
        ...this.property,
      };
    },
    // 解决后端字典类型不一致问题
    stringValue(value) {
      return String(value);
    },
  },
};
</script>

