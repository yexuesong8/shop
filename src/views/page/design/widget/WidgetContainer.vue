<template>
  <div v-if="element && element.did" class="widget-view-item" @click.stop="handleSelectWidget(index)">
    <div
      ref="widgetContainer"
      class="widget-view widget-view-container drag-widget"
      type="flex"
      :class="{active: selectWidget.did === element.did}"
    >
      <draggable
        v-model="element.children"
        :no-transition-on-drag="true"
        v-bind="{group:'people', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
        @add="handleWidgetAdd($event, element)"
      >
        <transition-group name="fade" tag="div" class="widget-view-form-list">
          <div v-for="(childItem, childIndex) in element.children" :key="`widget-${childIndex}`">
            <template v-if="childItem.code === 'pg-container'">
              <widget-container
                v-if="childItem && childItem.did"
                :key="childIndex"
                :element="childItem"
                :select.sync="selectWidget"
                :index="childIndex"
                :data="element"
                type="child"
                :property="property"
              />
            </template>
            <template v-else-if="childItem.code === 'pg-form'">
              <widget-form
                v-if="childItem && childItem.did"
                :key="childIndex"
                :element="childItem"
                :select.sync="selectWidget"
                :index="childIndex"
                :data="element"
                type="child"
                :property="property"
              />
            </template>
            <template v-else-if="childItem.code === 'pg-dialog'">
              <widget-dialog
                v-if="childItem && childItem.did"
                :key="childIndex"
                :element="childItem"
                :select.sync="selectWidget"
                :index="childIndex"
                :data="element"
                type="child"
                :property="property"
              />
            </template>
            <template v-else-if="childItem.code === 'pg-row'">
              <widget-row
                v-if="childItem && childItem.did"
                :key="childIndex"
                :element="childItem"
                :select.sync="selectWidget"
                :property="property"
                :index="childIndex"
                :data="element"
                type="child"
              />
            </template>
            <template v-else>
              <widget-item
                v-if="childItem && childItem.did"
                :key="childIndex"
                :element="childItem"
                :select.sync="selectWidget"
                :index="childIndex"
                :data="element"
                type="child"
                :property="property"
              />
            </template>
          </div>
        </transition-group>
      </draggable>
      <div v-if="selectWidget.did === element.did" class="widget-view-action">
        <i class="iconfont el-icon-document-copy" @click.stop="handleWidgetClone(index)" />
        <i class="iconfont el-icon-delete" @click.stop="handleWidgetDelete(index)" />
      </div>
    </div>
  </div>
</template>

<script>
import Draggable from 'vuedraggable';
import { randomCoding, handleStringFunction } from "@/views/page/design/utils/index";

export default {
  name: "WidgetContainer",
  components: {
    Draggable,
  },
  props: {
    element: {
      type: Object,
      default: () => {},
    },
    select: {
      type: Object,
      default: () => {},
    },
    index: {
      type: Number,
      default: 0,
    },
    data: {
      type: Object,
      default: () => {},
    },
    property: {
      type: Object,
      default: () => {},
    },
    type: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      selectWidget: this.select,
    };
  },
  watch: {
    element: {
      handler(value) {
        const { props } = value;
        if (props && (props["page-container-padding"] || props["page-container-margin"])) {
          if (props["page-container-padding"]) {
            const padding = handleStringFunction(props["page-container-padding"]);
            this.$nextTick(() => {
              Object.keys(padding).forEach(item => {
                this.$refs["widgetContainer"].style[item] = padding[item] + "px";
              });
            });
          }
          if (props["page-container-margin"]) {
            const margin = handleStringFunction(props["page-container-margin"]);
            this.$nextTick(() => {
              Object.keys(margin).forEach(item => {
                this.$refs["widgetContainer"].style[item] = margin[item] + "px";
              });
            });
          }
        }
      },
      deep: true,
      immediate: true,
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
  methods: {
    handleSelectWidget(index) {
      this.$store.commit("pagePanel/SET_IS_COMPONENT", false);
      switch (this.type) {
        case "list":
          this.selectWidget = this.data.list[index];
          break;
        case "child":
          this.selectWidget = this.data.children[index];
          break;
        default:
          break;
      }
    },
    handleWidgetAdd(event, element) {
      const { newIndex } = event;
      if (!element.children[newIndex]) return;
      const { id, code, props = {}, property } = element.children[newIndex];

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
      this.$set(element.children, newIndex, {
        ...element.children[newIndex],
        props: {
          ...defaultProps,
          ...props,
        },
        did,
        property: property || defaultProperty,
      });

      if (code === 'pg-row') {
        const { children } = element.children[newIndex];

        this.$set(element.children, newIndex, {
          ...element.children[newIndex],
          children: children ? children.map(item => ({ ...item })) : [
            { children: [] },
            { children: [] },
          ],
        });
      }
      if (code === 'pg-form' || code === 'pg-container' || code === 'pg-dialog') {
        const { children } = element.children[newIndex];

        this.$set(element.children, newIndex, {
          ...element.children[newIndex],
          children: children ? children.map(item => ({ ...item })) : [],
        });
      }
      this.selectWidget = element.children[newIndex];
    },
    // 复制
    handleWidgetClone(index) {
      let currentData = {};
      switch (this.type) {
        case "list":
          currentData = this.data.list;
          break;
        case "child":
          currentData = this.data.children;
          break;
        default:
          break;
      }
      const did = randomCoding();
      const data = JSON.parse(JSON.stringify(currentData[index]));
      const cloneData = {
        ...data,
        props: data.props,
        did,
      };
      currentData.splice((index + 1), 0, cloneData);
      this.$nextTick(() => {
        this.selectWidget = currentData[index + 1];
      });
    },
    // 删除
    handleWidgetDelete(index) {
      let currentData = {};
      switch (this.type) {
        case "list":
          currentData = this.data.list;
          break;
        case "child":
          currentData = this.data.children;
          break;
        default:
          break;
      }
      if (currentData.length - 1 === index) {
        if (index === 0) {
          this.selectWidget = {};
        } else {
          this.selectWidget = currentData[index - 1];
        }
      } else {
        this.selectWidget = currentData[index + 1];
      }
      this.$nextTick(() => {
        currentData.splice(index, 1);
      });
    },
  },
};
</script>

