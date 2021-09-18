<script>
export default {
  name: "DynamicLoadView",
  data() {
    return {
      dynamicView: null,
    };
  },
  methods: {
    dynamicLoadView(path) {
      try {
        this.dynamicView = require(`@/views/dynamic/${path}`).default;
      } catch (err) {
        console.error(err);
        console.log(`找不到对应路径的文件: /views/dynamic/${path}`);
      }
    },
  },
};
</script>
