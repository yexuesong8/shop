<template>
  <div class="rb-page-design-property">
    <div v-show="show && data.props">
      <!-- 组 -->
      <el-collapse v-model="activeList" class="rabbit-page-collapse properties">
        <el-collapse-item v-for="(proItem, proIndex) in data.property" :key="proIndex" :title="proItem.name" :name="proIndex">
          <div v-for="editItem in proItem.properties" :key="editItem.id">
            <setting-item :title="editItem.name" :baseline="baselineList.includes(editItem.editor)" :column="columnList.includes(editItem.editor)" :no-title="!noTitleList.includes(editItem.editor)">
              <component :is="editItem.editor" v-model="data.props[editItem.code]" :options="editItem.options" :type="editItem.code" :data="data" :list="list" @change="handleEditorChange" />
            </setting-item>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <!--    <div v-show="isEmptyObject(data) || !data.props">-->
    <!--      <input-editor-more v-model="list.events" type="events" :data="data" :list="list" @change="handleEditorChange" />-->
    <!--    </div>-->
  </div>
</template>

<script>
import SettingItem from "./item";
import { isEmptyObject } from "@monkey.do/monkey";

export default {
  components: {
    SettingItem,
  },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    list: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      activeNames: "",
      activeList: [], // 属性组
      noTitleList: ["column-editor", "table-actions"],
      baselineList: ["textarea-editor"],
      columnList: ["code-editor", "table-options"],
    };
  },
  computed: {
    show() {
      return !!(this.data && Object.keys(this.data).length > 0);
    },
  },
  watch: {
    data: {
      handler(val) {
        if (val && val.property) {
          this.activeList = [];
          val.property.forEach((item, index) => {
            this.activeList.push(index);
          });
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    isEmptyObject,
    handleEditorChange(data) {
      console.log(data, "editor change");
    },
  },
};
</script>
<style lang="scss" scoped>
  .ace-editor{
    width: 100%;
    height: 200px;
    min-height: 200px;
  }
</style>

