<script>
export default {
  name: "PageCreate",
  inject: ["$page"],
  methods: {
    showDetailForm() {
      if (this.$page) {
        const detailForm = this.$page.getDetailForm();
        if (detailForm) {
          detailForm.setType("create");
          detailForm.show();
        }
      }
    },
  },
};
</script>
