<template>
  <div
    v-if="element && element.did && element.props"
    class="widget-view widget-view-form drag-widget no-grid"
    :class="{active: selectWidget.did === element.did, 'is_req': element.props.required}"
    @click.stop="handleSelectWidget(index)"
  >
    <div class="widget-view-list flex">
      <div class="edit-mode">
        <component :is="element.code" v-if="componentsName.includes(element.code)" ref="componentDom" v-model="element.props.value" :data="element" v-bind="{ ...element.props }" />
        <!-- 组件选中操作 -->
        <div v-if="selectWidget.did === element.did" class="widget-view-action">
          <i class="iconfont el-icon-document-copy" @click.stop="handleWidgetClone(index)" />
          <i class="iconfont el-icon-delete" @click.stop="handleWidgetDelete(index)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Draggable from 'vuedraggable';
import { randomCoding } from "@/views/page/design/utils/index";

export default {
  name: "WidgetItem",
  inject: {
    componentNameList: {
      default: () => [],
    },
  },
  provide() {
    return {
      that: this,
    };
  },
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
  computed: {
    componentsName() {
      return this.componentNameList();
    },
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
    handleSelectWidget(index) {
      this.$store.commit("pagePanel/SET_IS_COMPONENT", false);
      switch (this.type) {
        case "list":
          this.selectWidget = this.data.list[index];
          break;
        case "child":
          this.selectWidget = this.data.children[index];
          break;
        case "hide":
          this.selectWidget = this.data.hide[index];
          break;
        default:
          break;
      }
    },
    handleWidgetDelete(index) {
      let list;
      switch (this.type) {
        case "list":
          list = this.data.list;
          break;
        case "child":
          list = this.data.children;
          break;
        case "hide":
          list = this.data.hide;
          break;
        default:
          break;
      }
      if (list.length - 1 === index) {
        if (index === 0) {
          this.selectWidget = {};
        } else {
          this.selectWidget = list[index - 1];
        }
      } else {
        this.selectWidget = list[index + 1];
      }
      this.$nextTick(() => {
        list.splice(index, 1);
      });
    },
    handleWidgetClone(index) {
      const list = this.data.list ? this.data.list : this.data.children;
      const did = randomCoding();
      const data = JSON.parse(JSON.stringify(list[index]));
      const cloneData = {
        ...data,
        props: data.props,
        did,
      };

      list.splice((index + 1), 0, cloneData);

      this.$nextTick(() => {
        this.selectWidget = list[index + 1];
      });
    },
    handleWidgetColAdd($event, row, colIndex) {
      const { newIndex, oldIndex, item } = $event;
      // 防止布局元素的嵌套拖拽
      if (item.className.indexOf('data-grid') >= 0) {
        // 如果是列表中拖拽的元素需要还原到原来位置
        item.tagName === 'DIV' && this.data.list.splice(oldIndex, 0, row.children[colIndex].children[newIndex]);
        row.children[colIndex].list.splice(newIndex, 1);
        return false;
      }
      const { id, props = {}, code, property } = row.children[colIndex].children[newIndex];
      const did = randomCoding();
      const defaultProperty = JSON.parse(JSON.stringify(this.property[id] || []));
      const defaultProps = {};
      // 属性值初始化
      defaultProperty.forEach(items => {
        items.properties.forEach(item => {
          defaultProps[item.code] = JSON.parse(JSON.stringify(item.defaultValue));
        });
      });
      this.$set(row.children[colIndex].children, newIndex, {
        ...row.children[colIndex].children[newIndex],
        props: {
          ...defaultProps,
          ...props,
        },
        did,
        property: property || defaultProperty,
      });

      if (code === 'pg-row') {
        const { children } = row.children[colIndex].children[newIndex];
        this.$set(row.children[colIndex].children, newIndex, {
          ...row.children[colIndex].children[newIndex],
          children: children ? children.map(item => ({ ...item })) : [
            { children: [] },
            { children: [] },
          ],
        });
      }
      this.selectWidget = row.children[colIndex].children[newIndex];
    },
  },
};
</script>

