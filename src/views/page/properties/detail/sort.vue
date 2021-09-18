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
    <div v-for="item in sortList" :key="item.id">
      <span>{{ item.name }}</span>
      <Draggable v-model="item.properties">
        <div v-for="val in item.properties" :key="val.id" class="group-list-item">{{ val.name }}</div>
      </Draggable>
    </div>
  </Dialog>
</template>

<script>
import { sort } from "@/api/page/propertiesDetail";
import Draggable from 'vuedraggable';
export default {
  name: "PeopertiesSort",
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
  },
  data() {
    return {
      loading: false,
      subTitle: "",
      // 排序
      idList: [],
    };
  },
  watch: {
    sortList: {
      handler(newValue, oldValue) {
        this.idList = newValue.map(item => {
          return item.properties.map(val => {
            return val.id;
          });
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
      const { statusCode } = await sort({ ids: this.idList });
      if (statusCode === 600) {
        this.msgSuccess("排序成功");
        this.$emit("close");
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .group-list-item{
    display: flex;
    justify-content: space-between;
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
