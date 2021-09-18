<template>
  <div class="main-content-container">
    <el-row>
      <h4>角色名称：<span class="text-primary-color">{{ roleName || "" }}</span></h4>
      <el-row class="mb20 clearfix">
        <!-- 默认第一个 直接取0 对应ID也设置为0 -->
        <TypeSelection class="fl" :on-change="handleOnChange" :default-value="defaultTabId" :data="typeSelectionData" />
        <el-button class="fr" type="primary" :loading="saveLoading" @click="handleSave">保存</el-button>
      </el-row>

      <el-table v-fixedTable :data="list" :span-method="spanMethod" :row-key="(row) => row.tableId + row.scopeId" @cell-click="handleCellClick">
        <el-table-column label="数据分类" prop="tableName" />
        <el-table-column label="范围/操作" prop="scopeName" />
        <el-table-column label="查看" prop="select">
          <el-table-column>
            <template slot="header">
              <el-checkbox :value="!!checkedAllTabs[`${curTab}-select`]" @change="(value) => headerCheckboxChange(value, 'select')" />
            </template>
            <template v-slot="scope">
              <input
                v-model="submit[`select-${scope.row.tableId}`]"
                class="data-auth-radio-input"
                type="radio"
                :value="`select-${scope.row.tableId}-${scope.row.scopeId}`"
                :name="`select-${scope.row.tableId}`"
                :disabled="getItemDisabled(scope.row, 'select')"
                @click.stop="($event) => handleRadioClick($event, scope.row, 'select')"
              >
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="新增" prop="insert">
          <el-table-column>
            <template slot="header">
              <el-checkbox :value="!!checkedAllTabs[`${curTab}-insert`]" @change="(value) => headerCheckboxChange(value, 'insert')" />
            </template>
            <template v-slot="scope">
              <input
                v-model="submit[`insert-${scope.row.tableId}`]"
                class="data-auth-radio-input"
                type="radio"
                :value="`insert-${scope.row.tableId}-${scope.row.scopeId}`"
                :name="`insert-${scope.row.tableId}`"
                :disabled="getItemDisabled(scope.row, 'insert')"
                @click.stop="($event) => handleRadioClick($event, scope.row, 'insert')"
              >
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="修改" prop="update">
          <el-table-column>
            <template slot="header">
              <el-checkbox :value="!!checkedAllTabs[`${curTab}-update`]" @change="(value) => headerCheckboxChange(value, 'update')" />
            </template>
            <template v-slot="scope">
              <input
                v-model="submit[`update-${scope.row.tableId}`]"
                class="data-auth-radio-input"
                type="radio"
                :value="`update-${scope.row.tableId}-${scope.row.scopeId}`"
                :name="`update-${scope.row.tableId}`"
                :disabled="getItemDisabled(scope.row, 'update')"
                @click.stop="($event) => handleRadioClick($event, scope.row, 'update')"
              >
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="删除" prop="delete">
          <el-table-column>
            <template slot="header">
              <el-checkbox :value="!!checkedAllTabs[`${curTab}-delete`]" @change="(value) => headerCheckboxChange(value, 'delete')" />
            </template>
            <template v-slot="scope">
              <input
                v-model="submit[`delete-${scope.row.tableId}`]"
                class="data-auth-radio-input"
                type="radio"
                :value="`delete-${scope.row.tableId}-${scope.row.scopeId}`"
                :name="`delete-${scope.row.tableId}`"
                :disabled="getItemDisabled(scope.row, 'delete')"
                @click.stop="($event) => handleRadioClick($event, scope.row, 'delete')"
              >
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
import { fetch, getByRoleId, save } from '@/api/system/authority/data';

export default {
  name: "AuthorityData",
  data() {
    return {
      defaultTabId: null,

      prevTableId: null, // tableId
      prevRowIndex: 0, // 合并Id
      concatRowNumber: 0, // 合并数量
      prevRowIndexs: [],
      concatRowNumbers: [],

      checkedAll: [], // 当前选中全部的集合
      checkedAllTabs: {}, // 当前Tab选中全部

      saveLoading: false,
      submit: {},
      tabs: [],
      curTab: "",
      list: [],

      roleName: "", // 当前分配数据权限角色名称
    };
  },

  computed: {
    typeSelectionData() {
      return this.tabs.map((item, index) => ({ id: index, name: item }));
    },
  },

  watch: {
    list: {
      handler: function(value) {
        if (value && value.length > 0) {
          this.reset();
          this.calcIndex(value);
        }
      },
      deep: true,
    },
    typeSelectionData: {
      handler: function() {
        this.defaultTabId = 0;
      },
    },
  },

  mounted() {
    const { params: { roleId }, query: { roleName }} = this.$router.history.current;

    this.roleName = roleName;

    function replaceScopeType(data = []) {
      let scopeTypeList = [];

      data["scopeTypeList"].forEach(type => {
        scopeTypeList.push({ ...type, ...data });
      });

      scopeTypeList = scopeTypeList.concat([
        { scopeName: "全部", scopeId: "customer-all", ...data },
      ]);
      return scopeTypeList;
    }

    // 获取所有数据
    fetch({}, { roleId }).then(res => {
      if (res.statusCode === 600) {
        const tabs = [];
        const data = {};

        // 获取tabs
        res.data.forEach(item => {
          const directoryName = item["directoryName"];
          if (tabs.indexOf(directoryName) === -1) {
            tabs.push(directoryName);
            data[directoryName] = {};
            data[directoryName]["types"] = [].concat(replaceScopeType(item));
            data[directoryName]["tables"] = [].concat([item]);
            data[directoryName][item.tableId] = item.scopeTypeList;
          } else {
            data[directoryName]["types"] = data[directoryName]["types"].concat(replaceScopeType(item));

            // 判断tableId是否已存在
            if (data[directoryName]["tables"].indexOf(item.tableId) === -1) data[directoryName]["tables"] = data[directoryName]["tables"].concat([item]);
            // tableId唯一 直接赋值
            data[directoryName][item.tableId] = item.scopeTypeList;
          }
        });

        // 默认取第一个
        this.list = data[tabs[0]]["types"];
        this.tabs = tabs;
        this.data = data;
        this.curTab = tabs[0];

        getByRoleId({}, { roleId }).then(res => {
          if (res.statusCode === 600) {
            const obj = {};
            res.data.forEach(item => {
              if (item.scopeType === "all") {
                obj[`${item.actionType}-${item.tableId}`] = `${item.actionType}-${item.tableId}-customer-all`;
              } else {
                obj[`${item.actionType}-${item.tableId}`] = `${item.actionType}-${item.tableId}-${item.scopeType}`;
              }
            });
            this.submit = { ...obj };
          }
        });
      }
    });
  },

  methods: {
    spanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (this.prevRowIndexs.indexOf(rowIndex) !== -1) {
          return [this.concatRowNumbers[this.prevRowIndexs.indexOf(rowIndex)], 1];
        }

        if (this.data[row["directoryName"]][row["tableId"]].length > 0) return [0, 0];

        return [1, 1];
      }
    },

    // 计算合并行/列index
    calcIndex(list) {
      // 设置合并
      list.forEach((item, index) => {
        if (this.prevTableId !== item.tableId) {
          // 计算合并行数
          if (this.prevTableId) {
            this.concatRowNumber = index - this.prevRowIndex;
            this.concatRowNumbers.push(this.concatRowNumber);
          }

          // 合并列开始rowIndex
          this.prevRowIndex = index;
          this.prevRowIndexs.push(index);

          // 最后一条数据 与 前一条不同的情况
          if (index === list.length - 1) {
            this.prevRowIndexs.splice(this.prevRowIndexs.length - 1, 1);
          }

          this.prevTableId = item.tableId;
        } else {
          // 最后一条数据 与 前一条相同的情况
          if (index === list.length - 1) {
            this.concatRowNumber = index - this.prevRowIndex + 1;
            this.concatRowNumbers.push(this.concatRowNumber);
          }
        }
      });
    },

    reset() {
      this.prevTableId = null; // tableId
      this.prevRowIndex = 0; // 合并Id
      this.concatRowNumber = 0; // 合并数量
      this.prevRowIndexs = [];
      this.concatRowNumbers = [];
    },

    headerCheckboxChange(value, name) {
      // 设置对应Tab 选中
      this.checkedAllTabs = { ...this.checkedAllTabs, [`${this.curTab}-${name}`]: !!value };

      // 设置submit
      // 获取当前Tab下的类目，并过滤expression
      const curTableIds = this.data[this.curTab].tables.map(item => item.tableId);
      if (value) { // 选中
        const obj = {};
        curTableIds.forEach(tableId => {
          obj[`${name}-${tableId}`] = `${name}-${tableId}-customer-all`;
        });
        this.submit = { ...this.submit, ...obj };
      } else { // 取消选中
        const obj = { ...this.submit };
        curTableIds.forEach(tableId => {
          Reflect.deleteProperty(obj, `${name}-${tableId}`);
        });
        this.submit = { ...obj };
      }

      // Object.keys(obj).filter(item => (item.indexOf(name) !== -1 && curTables.indexOf(item) !== -1 && item.indexOf("expression") === -1)).forEach(item => {
      //   obj = { ...obj, [item]: !!value };
      // });

      // let obj = {};
      //
      // // 获取当前Tab下的类目，并过滤expression
      // const curTables = this.data[this.curTab].tables.map(item => item.tableId);
      // Object.keys(obj).filter(item => (item.indexOf(name) !== -1 && curTables.indexOf(item) !== -1 && item.indexOf("expression") === -1)).forEach(item => {
      //   obj = { ...obj, [item]: !!value };
      // });
      //
      // this.submit = { ...this.submit, ...obj };
      //
      // // 设置全选
      // this.data[this.curTab].tables.forEach(item => {
      //   if (value) {
      //     this.checkedAll.push(`${item.tableId}-${name}`);
      //   } else {
      //     const index = this.checkedAll.indexOf(`${item.tableId}-${name}`);
      //     if (index !== -1) this.checkedAll.splice(index, 1);
      //   }
      // });
    },

    handleRadioClick($event, row, name) {
      const oldVal = this.submit[`${name}-${row.tableId}`];
      const newVal = `${name}-${row.tableId}-${row.scopeId}`;
      let submit = {};
      // 判断前后值是否一致，一致则表示取消选择
      if (oldVal === newVal) {
        submit = { ...this.submit, [`${name}-${row.tableId}`]: null };
        $event.target.checked = false;
      } else {
        submit = { ...this.submit, [`${name}-${row.tableId}`]: newVal };
      }
      this.submit = { ...submit };
    },

    handleCellClick(row, column, cell) {
      if (!cell.children[0].children[0]) return;
      const { tableId } = row;
      const newValue = cell.children[0].children[0] && cell.children[0].children[0].value || "";
      const type = newValue && newValue.split("-")[0];
      const radioKey = type + "-" + tableId;
      const oldValue = this.submit[radioKey];
      if (newValue === oldValue) {
        this.submit = { ...this.submit, [radioKey]: null };
        cell.children[0].children[0].checked = false;
      } else {
        this.submit = { ...this.submit, [radioKey]: newValue };
        cell.children[0].children[0].checked = true;
      }
    },

    // radio选项是否禁用 TODO: 无用，可删除
    getItemDisabled(row, name) {
      // 全选
      return this.checkedAll.indexOf(`${row.tableId}-${name}`) !== -1;
    },

    getItemPayload(datas, name) {
      let tables = [];
      Object.keys(this.data).forEach(key => {
        tables = tables.concat(this.data[key].tables);
      });

      const payload = [];

      tables.forEach(item => {
        // 判断是否选择全部
        if (this.checkedAllTabs[`${item["directoryName"]}-${name}`]) {
          payload.push({
            tableId: item.tableId,
            actionType: name,
            scopeType: "all",
          });
        } else {
          let obj = {
            tableId: item.tableId,
            actionType: name,
            scopeType: [],
          };

          // 遍历 查找选中的tableId scopeId
          datas.filter((data) => data === `${name}-${item.tableId}`).forEach(data => {
            const scopeType = this.submit[data];

            if (scopeType) {
              if (scopeType.includes("customer-all")) {
                obj.scopeType.push("all");
              } else {
                const scopeId = scopeType.split("-")[2];
                if (!data.includes("expression")) obj.scopeType.push(scopeId);
              }
            }
          });

          obj = { ...obj, scopeType: obj["scopeType"].join(",") };

          if ((obj.scopeType && !!obj.scopeType.length)) payload.push(obj);
        }
      });

      return payload;
    },

    handleOnChange(value) {
      this.curTab = value.name;
      this.list = this.data[value.name].types;
    },

    getPayload() {
      const selects = [];
      const deletes = [];
      const updates = [];
      const inserts = [];

      Object.keys(this.submit).forEach(item => {
        if (this.submit[item]) { // 过滤false 没有选中
          if (item.includes("select")) {
            selects.push(item);
          }
          if (item.includes("update")) {
            updates.push(item);
          }
          if (item.includes("insert")) {
            inserts.push(item);
          }
          if (item.includes("delete")) {
            deletes.push(item);
          }
        }
      });

      const selectPayload = this.getItemPayload(selects, "select");
      const updatePayload = this.getItemPayload(updates, "update");
      const deletePayload = this.getItemPayload(deletes, "delete");
      const insertPayload = this.getItemPayload(inserts, "insert");

      return [].concat(selectPayload, updatePayload, deletePayload, insertPayload);
    },

    handleSave() {
      const { roleId } = this.$router.history.current.params;
      const payload = this.getPayload();
      this.saveLoading = true;
      save(payload, { roleId }).then(res => {
        this.saveLoading = false;
        if (res.statusCode === 600) {
          this.$message.success("保存成功");
        }
      });
    },
  },
};
</script>

<style lang="scss">
  .data-auth-radio-input {
    cursor: pointer;
  }
</style>
