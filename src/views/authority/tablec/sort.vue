<template>
  <Dialog :visible="visible" title="权限字段排序" @close="handleClose" @confirm="handleConfirm">
    <div class="row">
      <div class="col">
        <div class="title">可加入</div>
        <draggable :key="notAllowList.length" v-model="notAllowList" group="field" class="draggable" :sort="false" animation="300" drag-class="dragClass">
          <transition-group>
            <div v-for="item in notAllowList" :key="item.id" class="not-allow-item item">{{ item.name }}</div>
          </transition-group>
        </draggable>
      </div>
      <div class="col">
        <div class="title">已加入</div>
        <draggable :key="allowList.length" v-model="allowList" group="field" animation="300" class="draggable" drag-class="dragClass">
          <transition-group>
            <div v-for="item in allowList" :key="item.id" class="allow-item item">{{ item.name }}</div>
          </transition-group>
        </draggable>
      </div>
    </div>
  </Dialog>
</template>
<script>
import draggable from 'vuedraggable';
import { fieldSort } from "@/api/system/table";

export default {
  components: {
    draggable,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      notAllowList: [],
      allowList: [],
      tableId: '',
    };
  },
  watch: {
    data(val) {
      if (val.tableId) {
        this.tableId = val.tableId;
        const list = val.fieldList.filter(item => item.type === 'entity' && ['1', '2'].includes(item.entityTableId));
        this.notAllowList = list.filter(item => item.allowScopeField !== 1);
        this.allowList = list.filter(item => item.allowScopeField === 1);
      }
    },
  },
  methods: {
    handleClose() {
      Object.assign(this.$data, this.$options.data());
      this.$emit('update:visible', false);
    },
    handleConfirm() {
      const payload = {
        tableId: this.tableId,
        fieldIds: this.allowList.map(item => item.id),
      };
      fieldSort(payload).then(res => {
        if (res.statusCode !== 600) return;
        this.handleClose();
        this.$emit('success');
        this.msgSuccess('更新成功');
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~@/assets/rabbit/styles/variables';

.dragClass {
  opacity: 1 !important;
  box-shadow: none !important;
  outline: none !important;
  background-image: none !important;
}
.draggable{
  min-height: 100px;
  span{
    display: block;
    min-height: inherit;
  }
}
.row {
  display: flex;
}
.title {
  padding: 6px 12px;
}
.col {
  width: 40%;
  flex: 1;
  padding: 10px;
  border: solid 1px #eee;
  border-radius: 5px;
}
.col + .col {
  margin-left: 10px;
}
.not-allow-item {
  background-color: #a9cdfc;
}
.allow-item {
  background-color: $sortBackgroundColor;
}
.item {
  padding: 6px 12px;
  margin: 0px 10px 0px 10px;
  border: solid 1px #eee;
}
.item:hover {
  // background-color: $sortBackgroundColor;
  cursor: move;
}
.item + .item {
  border-top: none;
  margin-top: 6px;
}
</style>
