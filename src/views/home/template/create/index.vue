<template>
  <div class="main-content-container rb-index-template-container full-fill">
    <el-container>
      <el-main>
        <el-row class="mb20" type="flex" justify="end">
          <el-col :span="20">
            <span style="font-weight: 700;font-size: 16px;">页面布局</span>
          </el-col>
          <el-col :span="4">
            <el-button class="fr" type="danger" @click="handleClean">清空</el-button>
          </el-col>
        </el-row>
        <div ref="layout" class="layout">
          <div ref="container" :key="key" class="grid-container">
            <div v-for="(num, index) in gridAmount" ref="gridItem" :key="`number${index}`" class="grid-item" @click="handleAdd($event, index)">+</div>
            <ComTemplate
              v-for="(item, i) in dragArray"
              :id="item.id"
              :key="`componente-${i}`"
              :data-template-id="item.id"
              :title="item.title"
              :image-src="item.imageSrc"
              :x="item.x + 3"
              :y="item.y + 1"
              :width="item.offsetWidth - 3"
              :height="item.offsetHeight - 2"
              :min-width="initModel.width"
              :min-height="initModel.height"
              :on-resize-start="onResizeStartCallback"
              :on-drag-start="onDragStartCallback"
              @resizing="onResizing"
              @dragging="onDrag"
              @resizestop="onResizeStop"
              @dragstop="onDragStop"
              @deleteItem="handleDeleteItem"
            />
          </div>
        </div>
      </el-main>
      <el-aside>
        <h3>页面信息</h3>
        <el-form ref="form" :model="form" label-width="auto" :rules="rules">
          <el-form-item label="模板名称:" prop="name">
            <el-input v-model="form.name" placeholder="请输入模板名称" />
          </el-form-item>
          <el-form-item label="适用对象:" prop="roleList">
            <DepartmentSelector
              v-model="form.roleList"
              data-source-uri="/api/v1/rabbit/system/role/find/all"
              multiple
              placeholder="请选择"
            />
          </el-form-item>
          <el-form-item v-if="showState" label="启用状态:" prop="status">
            <el-select v-model="form.status">
              <el-option label="启用" :value="1" />
              <el-option label="停用" :value="0" />
            </el-select>
          </el-form-item>
          <el-row type="flex" justify="center">
            <el-button type="primary" @click="handleSave">保存设置</el-button>
          </el-row>
        </el-form>
      </el-aside>
    </el-container>
    <ChooseCom :visible.sync="visible" @confirm="handleConfirm" />
  </div>
</template>

<script>
import { DepartmentSelector } from "@/components";
import ChooseCom from "./chooseCom";
import ComTemplate from "./template.vue";
import { createTemplate, getTemplate, updateTemplate } from "@/api/setCenter/home";
import { throttle } from "@monkey.do/monkey";

export default {
  name: "HomeTemplateCreate",
  components: {
    DepartmentSelector,
    ChooseCom,
    ComTemplate,
  },
  data() {
    return {
      visible: false,
      drag: false,
      form: {},
      target: [],
      rules: {
        name: [{ required: true, message: '请输入模板名称', trigger: 'change' }],
        roleList: [{ required: true, message: '请选择适用对象', trigger: 'change' }],
        status: [{ required: true, message: '请选择启用状态', trigger: 'change' }],
      },
      key: 1,
      dragArray: [],
      resizingEleId: '',
      initModel: {},
      currTarget: {},
      currIndex: undefined,
      gridAmount: 48,
    };
  },
  computed: {
    id() {
      return this.$route.query.id;
    },
    showState() {
      return this.$route.name === '编辑模板' && this.$route.query.id;
    },
  },
  mounted() {
    // const that = this;
    if (this.id) this._getTemplate();
    this.init();
    // this.watchSize(that.$refs.container);
    this.watchSize();
  },
  methods: {
    init() {
      const { width, height } = getComputedStyle(this.$refs.gridItem[0]);
      this.initModel = { height: parseFloat(height), width: parseFloat(width) };
    },

    watchSize() {
      const self = this;

      const throttleFn = throttle(() => {
        self.$nextTick(() => {
          self.init();
          self.resize();
        });
      }, 30);

      let resizeTimer = null;

      window.onresize = () => {
        clearTimeout(resizeTimer);
        throttleFn();
        resizeTimer = setTimeout(() => {
          self.$nextTick(() => {
            self.init();
            self.resize();
            self.$forceUpdate();
          });
        }, 200);
      };
    },
    _getTemplate() {
      if (!this.id) return;
      getTemplate({ id: this.id }).then(res => {
        if (res.statusCode !== 600) return;
        this.form = res.data;
        this.dragArray = JSON.parse(res.data.layout);
        this.resize();
      });
    },
    // 保存设置
    handleSave() {
      this.$refs.form.validate(valid => {
        if (!valid) return;
        this.form.layout = JSON.stringify(this.dragArray);
        this.form.componentList = this.dragArray.map(item => item.componentId);
        if (this.id) {
          updateTemplate(this.form).then(res => {
            if (res.statusCode !== 600) return;
            this.msgSuccess('修改成功');
          });
        } else {
          createTemplate(this.form).then(res => {
            if (res.statusCode !== 600) return;
            this.msgSuccess('创建成功');
          });
        }
      });
    },
    // 新增
    handleAdd(e, i) { // clientHeight/Width 元素的宽高, 不包括border
      this.currTarget = e.target;
      this.currIndex = i;
      this.visible = true;
    },
    handleConfirm(data) {
      const { offsetWidth, offsetHeight, offsetTop, offsetLeft } = this.currTarget;
      this.dragArray.push({
        id: Date.now(), // Date.now(); Math.round(Math.random() * (10 ** 15)) + ''
        componentId: data.componentId,
        title: data.name,
        imageSrc: data.src,
        path: data.path,
        gridWidth: 1,
        gridHeight: 1,
        gridLeft: Math.floor(offsetLeft / this.initModel.width),
        gridTop: Math.floor(offsetTop / this.initModel.height),
        offsetWidth: offsetWidth - 1, // 减掉1px border,更美观
        offsetHeight: offsetHeight - 1, // 减掉1px border,更美观
        x: offsetLeft,
        y: offsetTop,
      });
      this.visible = false;
    },
    handleClean() {
      this.$doingConfirm({ title: "清空页面布局", message: "确定清空当前页面布局吗？" })
        .then(() => {
          this.dragArray = [];
        })
        .catch(() => console.log("取消清空"));
    },
    handleDeleteItem(id) {
      const index = this.dragArray.findIndex(item => item.id === id);
      this.dragArray.splice(index, 1);
    },
    getIndex() {
      return this.dragArray.findIndex(item => item.id === this.resizingEleId);
    },
    onResizeStartCallback(handle, e) {
      this.init();
      const parent = e.target.parentNode;
      this.resizingEleId = Number(parent.dataset.templateId);
    },
    // 每当组件调整大小时调用。
    onResizing(left, top, height, width) {
      const index = this.getIndex();
      const newValue = {
        ...this.dragArray[index],
        offsetHeight: height,
        offsetWidth: width,
        x: left,
        y: top,
      };
      this.dragArray.splice(index, 1, newValue);
    },
    // 组件停止调整后调用
    onResizeStop(left, top, width, height) {
      const index = this.getIndex();
      const widthRatio = width / this.initModel.width;

      let newValue = {
        ...this.dragArray[index],
        x: left,
        y: top,
      };

      if (widthRatio <= 1.005) { // 最小宽度比是1.004，1.005作为判断条件
        newValue = {
          ...newValue,
          gridWidth: Math.floor(widthRatio),
          offsetWidth: this.initModel.width * Math.floor(widthRatio),
        };
      } else {
        newValue = {
          ...newValue,
          gridWidth: Math.ceil(widthRatio),
          offsetWidth: this.initModel.width * Math.ceil(widthRatio),
        };
      }

      const heightRatio = height / this.initModel.height;
      if (heightRatio <= 1.007) { // 最小高度比是1.006，1.007最为最为判断条件
        newValue = {
          ...newValue,
          gridHeight: Math.floor(heightRatio),
          offsetHeight: this.initModel.height * Math.floor(heightRatio),
        };
      } else {
        newValue = {
          ...newValue,
          gridHeight: Math.ceil(heightRatio),
          offsetHeight: this.initModel.height * Math.ceil(heightRatio),
        };
      }

      this.dragArray.splice(index, 1, newValue);
      this.resizingEleId = '';
    },

    onDragStartCallback({ target }) {
      if (target.className === 'delete') { // 修复按住关闭按钮可以拖动的bug
        return false;
      } else {
        while (!target.dataset.templateId) {
          target = target.parentNode;
        }
        this.resizingEleId = Number(target.dataset.templateId);
      }
    },
    // 每当拖动组件时调用。
    onDrag(x, y) { // 相对于父元素的offsetLeft和offsetTop
      const index = this.getIndex();
      if (index !== -1) {
        this.dragArray[index].x = x;
        this.dragArray[index].y = y;
      }
    },
    // x: 相对于根目录的left值，y: 相对于根目录的top值
    onDragStop(x, y) {
      const index = this.getIndex();
      if (index === -1) return;
      const xRatio = x / this.initModel.width;
      this.dragArray[index].gridLeft = Math.floor(xRatio);
      this.dragArray[index].x = Math.ceil(Math.floor(xRatio) * this.initModel.width);

      const yRatio = y / this.initModel.height;
      this.dragArray[index].gridTop = Math.floor(yRatio);
      this.dragArray[index].y = Math.ceil(Math.floor(yRatio) * this.initModel.height);
    },
    resize() {
      const newDragArray = this.dragArray.map((item) => {
        const newItem = { ...item };
        const offsetWidth = item.gridWidth * this.initModel.width;
        const offsetHeight = item.gridHeight * this.initModel.height;

        if (item.gridLeft !== undefined) newItem.x = item.gridLeft * this.initModel.width;
        if (item.gridTop !== undefined) newItem.y = item.gridTop * this.initModel.height;

        return {
          ...newItem,
          offsetWidth,
          offsetHeight,
        };
      });

      this.dragArray = [...newDragArray];
    },
    styleHandler(item) {
      return {
        width: item.offsetWidth - 2,
        height: item.offsetHeight - 2,
        x: item.x + 2,
        y: item.y + 1,
      };
    },
  },
};
</script>

<style lang="scss">
@import "~@/assets/rabbit/styles/mixin";
.rb-index-template-container {
  .el-container {
    width: 100%;
    height: 100%;
    overflow: auto;
    .el-main {
      min-width: 980px;
      margin-right: 20px;
      padding: 0;
      overflow: hidden;
    }
  }
  .layout{
    width: 100%;
    height: calc(100% - 52px);
    overflow: auto;
  }
  .grid-container {
    display: grid;
    position: relative;
    min-width: 900px;
    grid-template-columns: 16.6% 16.6% 16.6% 16.6% 16.6% 16.6%;
    justify-content: center;
    box-sizing: border-box;
    align-content: center;
    overflow: hidden;
    @include disabledUserSelect;
    border-bottom: 1px solid #999;
  }
  .grid-item {
    border-top: 1px solid #999;
    border-left: 1px solid #999;
    height: 12vh;
    display: flex;
    justify-content: center;
    align-items: center;
    &:nth-child(6n) {
      border-right: 1px solid #999;
    }
    &:hover {
      cursor: pointer;
    }
  }
}
</style>
