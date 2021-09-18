<template>
  <span :style="{display: 'inline-block', width: '100%'}" @click="handleDelete">{{ $attrs.label || "删除" }}</span>
</template>

<script>
import PageDelete from "@/components/Page/delete";

export default {
  name: "MoreDelete",
  mixins: [PageDelete],
};
</script>
