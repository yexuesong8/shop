<template>
  <!-- 排序 -->
  <Dialog
    v-if="visible"
    :title="title"
    :visible="visible"
    :loading="loading"
    width="350px"
    @cancel="cancel"
    @confirm="submitForm"
  >
    <Draggable v-model="typeList">
      <div v-for="val in typeList" :key="val.id" class="group-list-item">{{ val.name }}</div>
    </Draggable>
  </Dialog>
</template>

<script>
import { sortType } from "@/api/page/propertiesType";
import Draggable from 'vuedraggable';
export default {
  components: {
    Draggable,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    sortList: {
      type: Array,
      default: () => [],
    },
    update: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      loading: false,
      // 排序前
      typeList: [],
      // 排序后
      idList: [],
    };
  },
  watch: {
    sortList: {
      handler(newValue, oldValue) {
        this.typeList = newValue;
      },
      deep: true,
    },
    typeList: {
      handler(newValue, oldValue) {
        this.idList = newValue.map(item => {
          return item.id;
        });
      },
      deep: true,
    },
  },
  methods: {
    // 取消按钮
    cancel() {
      this.$emit("close");
    },
    // 排序提交
    async submitForm() {
      this.loading = true;
      const { statusCode } = await sortType({ ids: this.idList });
      if (statusCode === 600) {
        this.msgSuccess("排序成功");
        this.$emit("close");
        this.update();
      }
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.group-list-item{
  display: flex;
  align-items: center;
  height: 35px;
  background: #FDAFAF;
  color: #000;
  margin: 5px 0;
  padding: 0 40px;
  box-sizing: border-box;
  cursor:move;
}
</style>
