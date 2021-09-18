<script>
export default {
  name: "BaseEditor",
  model: {
    prop: "editorValue",
    event: "editorValueChange",
  },
  props: {
    editorValue: {
      type: null,
      default: "",
    },
    data: {
      type: [Array, Object],
      default: () => {},
    },
    list: {
      type: [Array, Object],
      default: () => {},
    },
    type: {
      type: String,
      default: "",
    },
    options: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      innerEditorValue: undefined,
    };
  },
  watch: {
    editorValue: {
      handler: function(value) {
        this.innerEditorValue = value;
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    setValue() {
      // this.$emit("update:editorValue", this.innerEditorValue);
      this.$emit("editorValueChange", this.innerEditorValue);
      this.$emit("change", { type: this.type, value: this.innerEditorValue });
    },
    getValue() {
    },
  },
};
</script>
