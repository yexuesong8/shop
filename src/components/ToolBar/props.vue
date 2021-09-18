<script>
export default {
  name: "ToolbarProps",
  props: {
    toolbarButtons: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isPrinting: false,
    };
  },
  created() {
    this.getPritingButton(this.toolbarButtons);
  },
  methods: {
    getPritingButton(data) {
      for (const item of data) {
        switch (typeof item) {
          case 'string':
            if (item === 'printing') {
              this.isPrinting = true;
              return false;
            }
            break;
          default:
            if (item.type === 'printing') {
              this.isPrinting = true;
              return false;
            } else if (item.type === 'more') {
              this.getPritingButton(item.props.data);
            }
        }
      }
    },
  },
};
</script>
