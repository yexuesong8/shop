<template>
  <div class="main-content-container">
    <el-row>
      <h4>角色名称：<span class="text-primary-color">{{ roleName || "" }}</span></h4>
      <el-row class="mb20 clearfix">
        <!-- 默认第一个 直接取0 对应ID也设置为0 -->
        <TypeSelection class="fl" :on-change="handleOnChange" :default-value="defaultTabId" :data="typeSelectionData" />
        <el-button class="fr" type="primary" :loading="saveLoading" @click="handleSave">保存</el-button>
      </el-row>
      <el-table :data="list" @cell-click="handleCellClick">
        <el-table-column label="报表名称" prop="name" />
        <el-table-column label="查看" prop="showDate">
          <el-table-column>
            <template v-slot:header="header">
              <el-checkbox :value="!!checkAll[`${curTab}-showData`]" @change="handleCheckAllChange($event, header, 'showData')">全选</el-checkbox>
            </template>
            <template slot-scope="scope">
              <input
                v-model="submit[`showData-${scope.row.id}`]"
                :value="`showData-${scope.row.id}`"
                class="data-auth-radio-input"
                type="checkbox"
                @click.stop="($event) => handleCheckBoxClick($event, scope.row, 'showData')"
              >
            </template>
          </el-table-column>
        </el-table-column>

        <el-table-column label="修改" prop="updateFile">
          <el-table-column>
            <template v-slot:header="header">
              <el-checkbox :value="!!checkAll[`${curTab}-updateFile`]" @change="handleCheckAllChange($event,header,'updateFile')">全选</el-checkbox>
            </template>
            <template v-slot="scope">
              <input
                v-model="submit[`updateFile-${scope.row.id}`]"
                :value="`updateFile-${scope.row.id}`"
                class="data-auth-radio-input"
                type="checkbox"
                @click.stop="($event) => handleCheckBoxClick($event, scope.row, 'updateFile')"
              >
            </template>
          </el-table-column>

        </el-table-column>
        <el-table-column label="删除" prop="deleteFile">
          <el-table-column>
            <template v-slot:header="header">
              <el-checkbox :value="!!checkAll[`${curTab}-deleteFile`]" @change="handleCheckAllChange($event,header,'deleteFile')">全选</el-checkbox>
            </template>
            <template v-slot="scope">
              <input
                v-model="submit[`deleteFile-${scope.row.id}`]"
                :value="`deleteFile-${scope.row.id}`"
                class="data-auth-radio-input"
                type="checkbox"
                @click.stop="($event) => handleCheckBoxClick($event, scope.row, 'deleteFile')"
              >
            </template>
          </el-table-column>
        </el-table-column>

        <el-table-column label="导出" prop="exportData">
          <el-table-column>
            <template v-slot:header="header">
              <el-checkbox :value="!!checkAll[`${curTab}-exportData`]" @change="handleCheckAllChange($event,header,'exportData')">全选</el-checkbox>
            </template>
            <template v-slot="scope">
              <input
                v-model="submit[`exportData-${scope.row.id}`]"
                :value="`exportData-${scope.row.id}`"
                class="data-auth-radio-input"
                type="checkbox"
                @click.stop="($event) => handleCheckBoxClick($event, scope.row, 'exportData')"
              >
            </template>
          </el-table-column>
        </el-table-column>

        <el-table-column label="打印" prop="printData">
          <el-table-column>
            <template v-slot:header="header">
              <el-checkbox :value="!!checkAll[`${curTab}-printData`]" @change="handleCheckAllChange($event,header,'printData')">全选</el-checkbox>
            </template>
            <template v-slot="scope">
              <input
                v-model="submit[`printData-${scope.row.id}`]"
                :value="`printData-${scope.row.id}`"
                class="data-auth-radio-input"
                type="checkbox"
                @click.stop="($event) => handleCheckBoxClick($event, scope.row, 'printData')"
              >
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
import { TypeSelection } from "@monkey.do/monkey";
import { backList, distributable, save } from '@/api/system/reportAuthority';
export default {
  // 不加入keep-alive 缓存
  // name: "Authority",
  components: {
    TypeSelection,
  },
  data() {
    return {
      defaultTabId: null,
      roleName: '',
      roleId: '',
      // 提交的数据
      submit: {},
      // 全选按钮
      curTab: '',
      tabs: [],
      // 保存loading效果默认为false
      saveLoading: false,
      // table的数据
      list: [],
      // 保存处理的数据
      data: {},
      // 全选按钮
      checkAll: {},
    };
  },
  computed: {
    typeSelectionData() {
      return this.tabs.map((item, index) => ({ id: index, name: item }));// 利用map进行遍历
    },
  },
  watch: {
    typeSelectionData: {
      handler() {
        this.defaultTabId = 0;
      },
    },
    // 监听路由的变化
    $route: {
      handler: function(val, oldVal) {
        this.roleName = val.query.roleName;
        this.roleId = val.query.id;
        this.checkAll = {};
      },
      // 深度观察监听
      deep: true,
    },
  },

  created() {
    const { id, roleName } = this.$route.query;
    this.roleName = roleName;
    this.roleId = id;
    // 调用回显的数据
    this.comeBack();
    // 调用分组的数据
    this.topGroupList();
  },
  activated() {
    const { id, roleName } = this.$route.query;
    this.roleName = roleName;
    this.roleId = id;

    this.comeBack();
    this.topGroupList();
  },
  methods: {
    handleCellClick(row, column, cell) {
      if (!cell.children[0].children[0]) return;
      const { id } = row;
      const newValue = cell.children[0].children[0] && cell.children[0].children[0].value || "";
      const type = newValue && newValue.split("-")[0];
      const checkBoxKey = `${type}-${id}`;
      const oldValue = this.submit[checkBoxKey];
      this.submit = { ...this.submit, [checkBoxKey]: !oldValue };
      cell.children[0].children[0].checked = !oldValue;
    },
    // 回显的数据
    comeBack() {
      const dataList = {};
      // 获取已分配回显的数据有问题
      backList({ roleId: this.roleId }).then(res => {
        if (res.statusCode === 600) {
          res.data.forEach(item => {
            dataList[`updateFile-${item.templateId}`] = item.updateFile === 1;
            dataList[`showData-${item.templateId}`] = item.showData === 1;
            dataList[`deleteFile-${item.templateId}`] = item.deleteFile === 1;
            dataList[`exportData-${item.templateId}`] = item.exportData === 1;
            dataList[`printData-${item.templateId}`] = item.printData === 1;
          });
          this.submit = { ...dataList };
        }
      });
    },
    // 分组的数据
    topGroupList() {
      const that = this;
      // 获取topGroupName分组表格以及处理数据
      distributable({}).then(res => {
        if (res.statusCode === 600) {
          const tabs = [];
          const data = {};
          res.data.forEach(item => {
            const topGroupName = item["topGroupName"];
            if (data[topGroupName]) {
              data[topGroupName].push(item);
            } else {
              data[topGroupName] = [item];
            }
            if (tabs.indexOf(topGroupName) === -1) {
              tabs.push(topGroupName);
            }
          });
          that.tabs = tabs;
          that.data = data;
          // 默认选择第一条数据
          that.list = data[tabs[0]];
        }
      });
    },

    // 点击之后出来对应的数据
    handleOnChange(value) {
      this.curTab = value.name;
      this.list = this.data[value.name];
    },
    // 保存新增
    handleSave() {
      const payload = {
        ruleList: [],
      };
      const keys = Object.keys(this.submit);
      keys.forEach(key => {
        const item = key;
        const splitArr = item.split("-");
        const type = splitArr[0];
        const id = splitArr[1];
        const value = this.submit[key];
        if (value) {
          const index = payload.ruleList.findIndex(item => item.templateId === id);
          if (index === -1) {
            payload.ruleList.push({
              roleId: this.roleId,
              templateId: id,
              [type]: 1,
            });
          } else {
            const rule = payload.ruleList[index];
            payload.ruleList.splice(index, 1, {
              ...rule,
              [type]: 1,
            });
          }
        }
      });
      // 保存接口
      save(payload.ruleList, { roleId: this.roleId }).then(res => {
        this.saveLoading = true;
        if (res.statusCode === 600) {
          this.saveLoading = false;
          this.$message.success("保存成功");
        }
      });
    },
    // 全选按钮
    handleCheckAllChange(isChecked, scope, name) {
      // 全选对象
      this.checkAll = { ...this.checkAll, [`${this.curTab}-${name}`]: !!isChecked };

      const ids = this.list.map(item => item.id);
      // 定义一个对象
      const newSubmit = {};
      ids.forEach(id => {
        newSubmit[`${name}-${id}`] = isChecked;
      });
      // 将对象进行浅克隆新的值进行覆盖
      this.submit = { ...this.submit, ...newSubmit };
    },
    // 选择事件选择一个复选框的时候自动加入submit中
    handleCheckBoxClick($event, row, name) {
      if ($event.target.checked === false) {
        this.submit = { ...this.submit, [`${name}-${row.id}`]: false };
      } else {
        this.submit = { ...this.submit, [`${name}-${row.id}`]: true };
      }
    },
  },
};
</script>
