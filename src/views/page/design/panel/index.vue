<template>
  <el-container class="fm2-container">
    <el-main class="fm2-main">
      <el-container>
        <!-- 菜单拖动栏 -->
        <div class="component-list-box">
          <div class="component-list-left">
            <div title="组件库" style="text-align: center;" @click="handleComponentToggle">
              <el-button icon="el-icon-menu" style="font-size: 28px;" type="text" />
            </div>
          </div>
          <el-aside v-show="isComponent" class="component-list-right">
            <div class="components-list">
              <div class="component-header">组件</div>
              <el-collapse v-model="activeNames" class="rabbit-page-collapse">
                <el-collapse-item v-for="(item, index) in componentPropertyData.componentGroups" :key="index" :title="item.name" :name="index">
                  <draggable
                    tag="ul"
                    :list="item.components"
                    v-bind="{group:{ name:item.name === '数据源' ? 'hide' : 'people', pull:'clone', put:false},sort: false, ghostClass: 'ghost'}"
                    :move="handleMove"
                    @end="handleMoveEnd"
                    @start="handleMoveStart"
                  >
                    <li v-for="(items, indexChild) in item.components" :key="indexChild" class="form-edit-widget-label" :class="{'no-put': item.type === 'divider'}" @click="handleClickAdd(indexChild, item.components)">
                      <a class="draggable-item">
                        <svg-icon class="draggable-item-icon" :icon-class="items.icon" />
                        <span>{{ items.name }}</span>
                      </a>
                    </li>
                  </draggable>
                </el-collapse-item>
              </el-collapse>
            </div>
          </el-aside>
        </div>
        <!-- 顶部操作按钮 -->
        <el-container class="center-container" direction="vertical">
          <el-header class="btn-bar" style="height: 45px;">
            <!-- <slot name="action" /> -->
            <el-button v-if="clearable" type="text" size="medium" icon="el-icon-delete" @click="handleClear">清空</el-button>
            <el-button type="primary" size="mini" @click="save">保存</el-button>
          </el-header>
          <el-main :class="{'widget-empty': widgetForm.list.length === 0}">
            <div @click="handleCloseComponentList">
              <widget
                ref="widgetForm"
                :data="widgetForm"
                :property="componentPropertyData.propertyGroups"
                :click-add.sync="clickDraggableComponent"
                :select.sync="widgetFormSelect"
              />
            </div>
          </el-main>
        </el-container>
        <!-- 属性设置区 -->
        <el-aside class="widget-config-container">
          <div class="components-list">
            <div class="component-header">属性设置</div>
            <property ref="property" :list="widgetForm" :data="widgetFormSelect" />
          </div>
        </el-aside>
      </el-container>
    </el-main>
    <confirmation-dialog :visible.sync="visible" :loading="loading" title="创建菜单" @on-submit="handleSubmit" />
  </el-container>
</template>

<script>
import Draggable from 'vuedraggable';
import Property from '@/views/page/design/panel/property/index';
import Widget from '@/views/page/design/widget/Widget.vue';
import confirmationDialog from "./dialog";
import designCodeCompiler from "@/views/page/design/compiler/design";
import { create, update } from "@/api/page/template";

export default {
  name: 'Panel',
  inject: {
    catalogId: {
      default: "",
    },
    getTemplateInfo: {
      default: () => {},
    },
  },
  components: {
    Draggable,
    Property,
    Widget,
    confirmationDialog,
  },
  props: {
    clearable: {
      type: Boolean,
      default: false,
    },
    widgetForm: {
      type: Object,
      default: () => {},
    },
    componentPropertyData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      activeNames: [],
      widgetFormSelect: {},
      clickDraggableComponent: undefined,
      visible: false,
      loading: false,
    };
  },
  computed: {
    detail() {
      return this.getTemplateInfo();
    },
    isComponent() {
      return this.$store.state.pagePanel.isComponent;
    },
  },
  watch: {
    widgetForm: {
      deep: true,
      handler(val) {
        this.$emit("update:widgetForm", val);
      },
    },
    componentPropertyData: {
      handler(value) {
        const { componentGroups = [] } = value;
        this.activeNames = [];
        componentGroups.forEach((item, index) => {
          this.activeNames.push(index);
        });
      },
    },
  },
  methods: {
    handleMoveEnd(evt) {
      this.$store.commit("pagePanel/SET_IS_COMPONENT", true);
    },
    handleMoveStart({ oldIndex }) {
      this.$store.commit("pagePanel/SET_IS_COMPONENT", false);
    },
    handleClickAdd(index, data) {
      this.clickDraggableComponent = data[index];
    },
    handleMove() {
      return true;
    },
    handleComponentToggle() {
      this.$store.commit("pagePanel/SET_IS_COMPONENT", !this.isComponent);
    },
    handleCloseComponentList() {
      this.$store.commit("pagePanel/SET_IS_COMPONENT", false);
    },
    handleSubmit(value = {}) {
      const { templateName: name, description } = value;
      delete value["templateName"];
      delete value["description"];
      const data = {
        ...this.detail,
        name,
        description,
        sourceCode: designCodeCompiler.build(this.widgetForm),
        catalogId: this.catalogId,
        menu: value,
      };
      this.loading = true;
      if (data.id) {
        update(data).then(res => {
          if (res.statusCode === 600) {
            this.msgSuccess("操作成功");
            this.visible = false;
            this.$router.go(-1);
          }
        }).finally(() => {
          this.loading = false;
        });
      } else {
        create(data).then(res => {
          if (res.statusCode === 600) {
            this.msgSuccess("操作成功");
            this.visible = false;
            this.$router.go(-1);
          }
        }).finally(() => {
          this.loading = false;
        });
      }
    },
    save() {
      this.visible = true;
    },
    handleClear() {
      this.$emit("update:widgetForm", { list: [], hide: [], events: {}, style: "" });
      this.widgetFormSelect = {};
    },
    blurSelect() {
      this.widgetFormSelect = {};
    },
  },
};
</script>

<style lang="scss">
.widget-empty{
  background-position: 50%;
}
</style>
