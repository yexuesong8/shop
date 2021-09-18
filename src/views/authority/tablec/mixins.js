export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '新增字段',
    },
    currentRow: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    handleClose() {
      this.form = {};
      this.$refs.form.resetFields();
      this.$emit('update:visible', false);
      this.$emit('update:currentRow', {});
    },
    handleRequest(method, msg) {
      this.loading = true;
      this[method](this.form).then(res => {
        if (res.statusCode !== 600) return;
        this.handleClose();
        this.$emit('success');
        this.msgSuccess(msg);
      }).finally(() => (this.loading = false));
    },
  },
};
