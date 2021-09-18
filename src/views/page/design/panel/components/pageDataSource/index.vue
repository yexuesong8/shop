<template>
  <div>id="{{ id }}"&nbsp;&nbsp;&nbsp;source="{{ source }}"&nbsp;&nbsp;&nbsp;type="{{ dataSourceType }}"</div>
</template>

<script>
export default {
  name: "PgDataSource",
  props: {
    id: {
      type: String,
      default: "",
    },
    source: {
      type: String,
      default: "",
    },
    dataSourceType: {
      type: String,
      default: "",
    },
  },
};
</script>
