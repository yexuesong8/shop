<template>
  <div v-if="element && element.did && element.props" class="widget-view-item" @click.stop="handleSelectWidget(index)">
    <el-row
      class="widget-col widget-view drag-widget"
      type="flex"
      :gutter="Number(element.props.gutter)"
      :class="{active: selectWidget.did === element.did}"
    >
      <el-col v-for="(colItem, colIndex) in element.children" :key="colIndex" :span="Number(element.props.column.split(':')[colIndex])">
        <draggable
          v-model="colItem.children"
          :no-transition-on-drag="true"
          v-bind="{group:'people', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
          @add="handleWidgetColAdd($event, element, colIndex)"
        >
          <transition-group name="fade" tag="div" class="widget-col-list">
            <div v-for="(childItem, childIndex) in colItem.children" :key="`widget-row-${childIndex}`">
              <template v-if="childItem.code === 'pg-form'">
                <widget-form
                  v-if="childItem && childItem.did"
                  :key="childIndex"
                  :element="childItem"
                  :select.sync="selectWidget"
                  :index="childIndex"
                  :data="colItem"
                  type="child"
                  :property="property"
                />
              </template>
              <template v-else-if="childItem.code === 'pg-container'">
                <widget-container
                  v-if="childItem && childItem.did"
                  :key="childIndex"
                  :element="childItem"
                  :select.sync="selectWidget"
                  :index="childIndex"
                  :data="colItem"
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
                  :data="colItem"
                  type="child"
                  :property="property"
                />
              </template>
              <template v-else-if="childItem.code === 'pg-row'">
                <widget-row
                  v-if="childItem && childItem.did"
                  :key="childIndex"
                  :index="childIndex"
                  :element="childItem"
                  :select.sync="selectWidget"
                  :property="property"
                  :data="colItem"
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
                  :data="colItem"
                  type="child"
                  :property="property"
                />
              </template>
            </div>
          </transition-group>
        </draggable>
        <div v-if="selectWidget.did === element.did" class="widget-view-action widget-col-action">
          <i class="iconfont el-icon-document-copy" @click.stop="handleWidgetClone(index)" />
          <i class="iconfont el-icon-delete" @click.stop="handleWidgetDelete(index)" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Draggable from 'vuedraggable';
import { randomCoding } from "@/views/page/design/utils/index";

export default {
  name: "WidgetRow",
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
    data: {
      type: Object,
      default: () => {},
    },
    property: {
      type: Object,
      default: () => {},
    },
    index: {
      type: Number,
      default: 0,
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
    // 选中
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
    // 新增
    handleWidgetColAdd(event, element, colIndex) {
      const { newIndex, oldIndex, item } = event;
      if (!element.children[colIndex].children[newIndex]) return;
      const currentData = element.children[colIndex];
      // 防止布局元素的嵌套拖拽
      if (item.className.indexOf('data-grid') >= 0) {
        // 如果是列表中拖拽的元素需要还原到原来位置
        item.tagName === 'DIV' && this.data.list.splice(oldIndex, 0, currentData.children[newIndex]);
        currentData.list.splice(newIndex, 1);
        return false;
      }
      const { id, props = {}, property, code } = currentData.children[newIndex];
      const did = randomCoding();
      const defaultProperty = JSON.parse(JSON.stringify(this.property[id] || []));
      const defaultProps = {};
      // 属性值初始化
      defaultProperty.forEach(items => {
        items.properties.forEach(item => {
          defaultProps[item.code] = JSON.parse(JSON.stringify(item.defaultValue));
        });
      });
      this.$set(currentData.children, newIndex, {
        ...currentData.children[newIndex],
        props: {
          ...defaultProps,
          ...props,
        },
        did,
        property: property || defaultProperty,
      });

      if (code === 'pg-row') {
        const { children } = currentData.children[newIndex];

        this.$set(currentData.children, newIndex, {
          ...currentData.children[newIndex],
          children: children ? children.map(item => ({ ...item })) : [
            { children: [] },
            { children: [] },
          ],
        });
      }
      if (code === 'pg-form' || code === 'pg-container' || code === 'pg-dialog') {
        const { children } = currentData.children[newIndex];

        this.$set(currentData.children, newIndex, {
          ...currentData.children[newIndex],
          children: children ? children.map(item => ({ ...item })) : [],
        });
      }
      this.selectWidget = currentData.children[newIndex];
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

