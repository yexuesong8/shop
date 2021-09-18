<template>
  <el-form :model="form" :rules="rules" class="widget-form">
    <div class="widget-form-container">
      <div v-if="data.list.length === 0" class="form-empty">从左侧拖拽来添加字段</div>
      <div class="widget-form-content" @click="handleWrapClick">
        <draggable
          v-model="data.list"
          class=""
          v-bind="{group:'people', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
          @add="handleWidgetAdd"
        >
          <transition-group name="fade" tag="div" class="widget-form-list">
            <template v-for="(element, index) in data.list">
              <!--分栏-->
              <template v-if="element.code === 'pg-row'">
                <widget-row
                  v-if="element && element.did"
                  :key="index"
                  :index="index"
                  :element="element"
                  :select.sync="selectWidget"
                  :property="property"
                  :data="data"
                  type="list"
                />
              </template>
              <!--container容器-->
              <template v-else-if="element.code === 'pg-container'">
                <widget-container
                  v-if="element && element.did"
                  :key="index"
                  :element="element"
                  :select.sync="selectWidget"
                  :index="index"
                  :data="data"
                  type="list"
                  :property="property"
                />
              </template>
              <!--dialog-->
              <template v-else-if="element.code === 'pg-dialog'">
                <widget-dialog
                  v-if="element && element.did"
                  :key="index"
                  :element="element"
                  :select.sync="selectWidget"
                  :index="index"
                  :data="data"
                  type="list"
                  :property="property"
                />
              </template>
              <!--表单容器-->
              <template v-else-if="element.code === 'pg-form'">
                <widget-form
                  v-if="element && element.did"
                  :key="index"
                  :element="element"
                  :select.sync="selectWidget"
                  :index="index"
                  :data="data"
                  type="list"
                  :property="property"
                />
              </template>
              <template v-else>
                <widget-item
                  v-if="element && element.did"
                  :key="index + 'noRow'"
                  :element="element"
                  :select.sync="selectWidget"
                  :index="index"
                  :data="data"
                  type="list"
                  :property="property"
                />
              </template>
            </template>
          </transition-group>
        </draggable>
        <!-- 隐藏组件 -->
        <div style="position: relative">
          <draggable
            v-model="data.hide"
            v-bind="{group:'hide', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
            @add="handleHideComponentAdd"
          >
            <transition-group name="fade" tag="div" class="widget-form-list hide-component">
              <div v-for="(element, index) in data.hide" :key="`widget-${index}`">
                <widget-item
                  v-if="element.code !== 'pg-row'"
                  :key="index + 'hide'"
                  :element="element"
                  :select.sync="selectWidget"
                  :index="index"
                  :data="data"
                  type="hide"
                  :property="property"
                /></div>
            </transition-group>
          </draggable>
          <div v-if="data.hide.length === 0" class="form-empty hide">隐藏组件</div>
        </div>
      </div>
    </div>
  </el-form>
</template>

<script>
import { isEmptyObject } from '@monkey.do/monkey';
import Draggable from 'vuedraggable';
import { randomCoding } from "@/views/page/design/utils/index";

export default {
  name: "Widget",
  components: {
    Draggable,
  },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    select: {
      type: Object,
      default: () => {},
    },
    clickAdd: {
      type: Object,
      default: () => {},
    },
    property: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      selectWidget: this.select,
      form: {
        name: "",
      },
      rules: {
        name: [{ required: true, message: "不能为空", trigger: "change" }],
      },
    };
  },
  watch: {
    clickAdd: { // 点击组件添加到拖拽框
      handler(val) {
        if (!isEmptyObject(val)) {
          if (val.code === "pg-data-source") {
            this.data.hide.push(val);
            this.handleHideComponentAdd({
              newIndex: this.data.hide.length - 1,
            });
          } else {
            this.data.list.push(val);
            this.handleWidgetAdd({
              newIndex: this.data.list.length - 1,
            });
          }
          this.$emit("update:clickAdd", {});
        }
      },
      deep: true,
    },
    select: {
      handler(val) {
        this.selectWidget = val;
      },
      deep: true,
      immediate: true,
    },
    selectWidget: {
      handler(val) {
        this.$emit('update:select', val);
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    document.body.ondrop = function(event) {
      const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
      if (isFirefox) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
  },
  methods: {
    isEmptyObject,
    handleWrapClick() {
      this.selectWidget = {}; // 点击空白
    },
    handleWidgetAdd(evt) {
      const newIndex = evt.newIndex;
      if (!this.data.list[newIndex]) return;

      const { code, id, props = {}, property } = this.data.list[newIndex];

      const defaultProperty = JSON.parse(JSON.stringify(this.property[id] || []));

      const defaultProps = {};
      // 属性值初始化
      defaultProperty.forEach(items => {
        items.properties.forEach(item => {
          props[item.code] = JSON.parse(JSON.stringify(item.defaultValue));
        });
      });
      // 为拖拽到容器的元素添加唯一 did
      const did = randomCoding();
      this.$set(this.data.list, newIndex, {
        ...this.data.list[newIndex],
        props: {
          ...defaultProps,
          ...props,
        },
        did,
        property: property || defaultProperty,
      });

      if (code === 'pg-row') {
        const { children } = this.data.list[newIndex];

        this.$set(this.data.list, newIndex, {
          ...this.data.list[newIndex],
          children: children ? children.map(item => ({ ...item })) : [
            { children: [] },
            { children: [] },
          ],
        });
      }
      if (code === 'pg-form' || code === 'pg-container' || code === 'pg-dialog') {
        const { children } = this.data.list[newIndex];
        this.$set(this.data.list, newIndex, {
          ...this.data.list[newIndex],
          children: children ? children.map(item => ({ ...item })) : [],
        });
      }
      this.selectWidget = this.data.list[newIndex];
    },
    handleHideComponentAdd(event) {
      const newIndex = event.newIndex;
      if (!this.data.hide[newIndex]) return;
      const { id, property, props = {}} = this.data.hide[newIndex];

      const defaultProperty = JSON.parse(JSON.stringify(this.property[id] || []));
      const defaultProps = {};
      // 属性值初始化
      defaultProperty.forEach(items => {
        items.properties.forEach(item => {
          defaultProps[item.code] = JSON.parse(JSON.stringify(item.defaultValue));
        });
      });
      // 为拖拽到容器的元素添加唯一 did
      const did = randomCoding();
      this.$set(this.data.hide, newIndex, {
        ...this.data.hide[newIndex],
        props: {
          ...defaultProps,
          ...props,
        },
        did,
        property: property || defaultProperty,
      });
      this.selectWidget = this.data.hide[newIndex];
    },
  },
};
</script>
