<script>
export default {
  name: "PageUpdate",
  inject: ["$page"],
  methods: {
    showDetailForm(id) {
      if (this.$page) {
        const detailForm = this.$page.getDetailForm();
        if (detailForm) {
          detailForm.load(id, (res) => {
            if (res.statusCode === 600) {
              detailForm.show(res.data);
            }
          });
        }
      }
    },
  },
};
</script>
