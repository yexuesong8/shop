<template>
  <MainContainer>
    <FixTableHeight :has-pagination="false" :has-filter-search="false">
      <template #top>
        <el-row class="clearfix">
          <!-- 默认第一个 直接取0 对应ID也设置为0 -->
          <TypeSelection class="fl" :on-change="handleOnChange" :default-value="defaultTabId" :data="typeSelectionData" />
          <el-button class="fr refbtn" :loading="loading" icon="el-icon-refresh-right" plain @click="refresh" />
          <el-button class="fr" type="primary" :loading="loading" @click="handleSave">保存</el-button>
        </el-row>
      </template>
      <template #bottom>
        <el-table :data="list" :span-method="spanMethod" border>
          <el-table-column label="数据分类" prop="tableName" />
          <el-table-column label="范围" prop="scopeName">
            <template slot-scope="scope">
              <span>{{ scope.row.scopeName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="判定字段" prop="fields">
            <template slot-scope="scope">
              <el-checkbox
                v-for="(item, index) in (scope.row.fields || [])"
                :key="item.fieldId + index"
                v-model="submit[`${scope.row.tableId}-${scope.row.scopeName}-${item.fieldId}`]"
                @change="(value) =>handleCheckboxChange(value, `${scope.row.tableId}-${scope.row.scopeName}-${item.fieldId}`)"
              >{{ item.fieldName }}</el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="判定表达式" prop="fieldName">
            <template slot-scope="scope">
              <span
                class="mock-a color-expression"
                :class="getItemClassName(scope.row)"
                @click="() => handleExpressionClick(scope.row)"
              >
                表达式
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="action">
            <template slot-scope="scope">
              <el-button type="text" @click="handleAddScope(scope.row)">新增</el-button>
              <el-button v-if="getDeleteShow(scope.row)" type="text" @click="handleDeleteScope(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </FixTableHeight>

    <Dialog title="表达式" :visible="expressionVisible" @cancel="handleExpressionCancel" @confirm="handleExpressionConfirm">
      <el-input placeholder="SQL条件 可使用占位符${userId}代表当前登录人，${deptId}代表当前登录人部门" :value="expressionValue" type="textarea" :autosize="{ minRows: 4, maxRows: 8}" @input="handleExpressionInput" />
    </Dialog>
    <Dialog title="新增范围" :visible="newScopeVisible" @confirm="handleScopeConfirm" @cancel="handleScopeCancel">
      <el-form ref="scopeForm" :model="form" :rules="scopeRules" label-width="auto">
        <el-form-item label="范围名称:" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
      </el-form>
    </Dialog>
  </MainContainer>
</template>

<script>
import FixTableHeight from "@/components/FixTableHeight/index.vue";
import { fetch, save } from "@/api/system/authority/rules";

export default {
  name: "AuthorityRules",
  components: { FixTableHeight },
  data() {
    return {
      prevTableId: null, // tableId
      prevRowIndex: 0, // 合并Id
      concatRowNumber: 0, // 合并数量
      prevRowIndexs: [],
      concatRowNumbers: [],
      loading: false,
      defaultTabId: null,
      submit: {},
      tables: [],
      tabs: [],
      list: [],
      curRow: {}, // 当前点击行
      expressionValue: "", // 表达式值
      expressionVisible: false, // 表达式visible
      newScope: {
      },
      newScopeVisible: false, // 新增范围visible
      scopeRules: {
        // sort: [{ required: true, message: "请选择数据分类" }],
        name: [{ required: true, validator: this.validateNewScopeName }],
      },
      newScopeTableId: null,
      newScopeRow: null, // 新增scope的当前row
      form: {},
    };
  },

  computed: {
    typeSelectionData() {
      return Object.keys(this.tabs).map((item, index) => ({ id: index, name: item }));
    },
  },

  watch: {
    typeSelectionData: {
      handler: function() {
        this.defaultTabId = 0;
      },
    },
    list: {
      handler: function(value) {
        if (value && value.length > 0) {
          this.reset();
          this.calcIndex(value);
        }
      },
      immediate: true,
      deep: true,
    },
  },

  mounted() {
    this.init();
  },

  methods: {
    init(tab) {
      this.loading = true;
      fetch().then(res => {
        this.loading = false;
        if (res.statusCode === 600) {
          this.dataFormatter(res.data, tab);
        }
      });
    },
    // 刷新
    refresh() {
      this.init(this.curTab);
    },
    spanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (this.prevRowIndexs.indexOf(rowIndex) !== -1) {
          return [this.concatRowNumbers[this.prevRowIndexs.indexOf(rowIndex)], 1];
        }
        return [0, 0];
      }
    },

    dataFormatter(data, tab) {
      const tabs = {};
      let totalList = [];
      const tables = {};

      data.forEach(item => {
        let tableItemData = { ...item };

        const directoryName = tableItemData["directoryName"]; // 目录名称

        // 处理fields数据
        const fields = [];
        (item.fields || []).forEach(field => {
          fields.push(field);
          if (field.fieldType === "2") fields.push({ ...field, fieldName: `${field.fieldName}及下级`, fieldId: `${field.fieldId}:` });
        });

        tableItemData = { ...tableItemData, fields };

        // 处理TABLE数据
        let customList = item.customList || [];
        if (customList && customList > 0) {
          customList.push(this.getScopeList(tableItemData.scopes, tableItemData));
        } else {
          customList = this.getScopeList(tableItemData.scopes, tableItemData);
        }

        item.scopes.forEach(scope => {
          tables[item.tableId] = { ...tables[item.tableId], [scope.scopeName]: { ...scope }};
        });

        // 设置数据
        if (!tabs[directoryName]) tabs[directoryName] = {};
        tabs[directoryName][item.tableName] = { ...item, customList, fields };
        totalList = totalList.concat(customList);
      });

      this.tabs = tabs;
      this.curTab = tab || Object.keys(tabs)[0];
      this.setTableList(this.curTab);
      this.setSubmit(totalList);
      this.tables = tables;
    },

    getScopeList(scopes, item) {
      let scopeList = [];

      if (scopes.length) {
        scopes.forEach(scope => {
          scopeList.push({
            ...scope,
            ...item,
          });
        });
      } else {
        scopeList = [{ ...item }];
      }
      return scopeList;
    },

    handleOnChange(value) {
      this.curTab = value.name;
      this.setTableList(this.curTab);
    },

    handleSave() {
      let tables = {}; // 先将同一table归集到一起 存储格式为 { tableId: { scopeName1: { ...scopeData }, scopeName2: { ...scopeData }, } }
      // 将同一table 同一范围集合
      Object.keys(this.submit).forEach(key => {
        const arr = key.split("-");
        const tableId = arr[0];
        const scopeName = arr[1];
        const fieldId = arr[2];

        // 勾选中
        if (this.submit[key]) {
          // 已存在scopeName范围的数据
          if (tables[tableId] && tables[tableId][scopeName]) {
            // 表达式
            if (key.includes("expression")) {
              tables = {
                ...tables,
                [tableId]: {
                  ...tables[tableId],
                  [scopeName]: { ...tables[tableId][scopeName], scopeExpression: this.submit[key] },
                },
              };
            } else {
              tables = {
                ...tables,
                [tableId]: {
                  ...tables[tableId],
                  [scopeName]: { ...tables[tableId][scopeName], scopeFieldIds: tables[tableId][scopeName].scopeFieldIds.concat(fieldId) },
                },
              };
            }
          } else {
            if (key.includes("expression")) {
              tables = {
                ...tables,
                [tableId]: {
                  ...tables[tableId],
                  [scopeName]: { scopeId: this.tables[tableId][scopeName]["scopeId"] || "", scopeName, scopeFieldIds: [], scopeExpression: this.submit[key] },
                },
              };
            } else {
              tables = {
                ...tables,
                [tableId]: {
                  ...tables[tableId],
                  [scopeName]: { scopeId: this.tables[tableId][scopeName]["scopeId"] || "", scopeName, scopeFieldIds: [fieldId], scopeExpression: "" },
                },
              };
            }
          }
        } else {
          if (tables[tableId] && !tables[tableId][scopeName]) {
            tables = {
              ...tables,
              [tableId]: {
                ...tables[tableId],
                [scopeName]: { scopeId: this.tables[tableId][scopeName]["scopeId"] || "", scopeName, scopeFieldIds: [], scopeExpression: "" },
              },
            };
          }
        }
      });

      // 将同一tableId集合
      const data = [];
      Object.keys(tables).forEach(table => {
        let scopes = [];
        Object.keys(tables[table]).forEach(scopeKey => {
          scopes = scopes.concat({ ...tables[table][scopeKey], scopeFieldIds: tables[table][scopeKey]["scopeFieldIds"].join(",") });
        });
        data.push({ tableId: table, scopes });
      });

      this.loading = true;
      save(data).then(res => {
        this.loading = false;
        if (res.statusCode === 600) {
          this.$message.success("保存成功");
        }
      });
    },

    // 计算合并index
    calcIndex(list) {
      list.forEach((item, index) => {
        if (this.prevTableId !== item.tableId) {
          // 计算合并行数
          if (this.prevTableId) {
            this.concatRowNumber = index - this.prevRowIndex;
            this.concatRowNumbers.push(this.concatRowNumber);
          }

          // 合并行开始rowIndex
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

    setTableList(tab) {
      if (tab) {
        const tables = this.tabs[tab];
        let list = [];
        Object.keys(tables).forEach(key => {
          const customList = tables[key].customList || [];
          list = list.concat(customList);
        });
        this.list = list;
      }
    },

    // 设置选中数据
    setSubmit(list) {
      const submit = {};
      list.forEach(item => {
        if (item.scopes && item.scopes.length > 0) {
          item.scopes.forEach(scope => {
            // 先将全部fileds存起来
            item.fields.forEach(filed => {
              submit[`${item.tableId}-${scope.scopeName}-${filed.fieldId}`] = false;
            });

            // 表达式
            if (scope.scopeExpression) submit[`${item.tableId}-${scope.scopeName}-expression`] = scope.scopeExpression;
            // 范围fields
            if (scope.scopeFieldIds) {
              const arr = scope.scopeFieldIds.split(",");
              if (arr.length) {
                arr.forEach(scopeFieldId => {
                  // 设置选中的范围fields
                  submit[`${item.tableId}-${scope.scopeName}-${scopeFieldId}`] = true;
                });
              }
            }
          });
        }
      });
      this.submit = { ...this.submit, ...submit };
    },

    // 判断删除是否显示
    getDeleteShow(row) {
      return row.customType === "new" || (row.scopeName !== "本人" && row.scopeName !== "本部门" && row.scopeName !== "本部门及下级");
    },

    // checkbox 改变设置submit
    handleCheckboxChange(value, key) {
      this.submit = { ...this.submit, [key]: value };
    },

    // 获取表达式class
    getItemClassName(row) {
      return {
        // disabled: this.checkedAll.indexOf(`${row.tableId}-${name}`) !== -1 || !!this.submitData[`${name}-${row.tableId}`],
        isValue: this.submit[`${row.tableId}-${row.scopeName}-expression`],
      };
    },

    // 表达式点击
    handleExpressionClick(row) {
      this.expressionVisible = true;
      this.curRow = { ...row };
      this.expressionValue = this.submit[`${row.tableId}-${row.scopeName}-expression`];
    },

    // 表达式取消
    handleExpressionCancel() {
      this.expressionVisible = false;
      this.curRow = {};
      this.expressionValue = undefined;
    },

    // 表达式输入
    handleExpressionInput(value) {
      this.expressionValue = value;
    },

    // 表达式确定
    handleExpressionConfirm() {
      this.submit = { ...this.submit, [`${this.curRow.tableId}-${this.curRow.scopeName}-expression`]: this.expressionValue };
      this.handleExpressionCancel();
    },

    // 新增scope
    handleAddScope(row) {
      this.newScopeVisible = true;
      this.newScopeRow = row;
    },

    // 删除scope
    handleDeleteScope(row) {
      this.$confirm('是否确认删除名称为"' + (row.scopeName || "") + '"的范围?', '删除范围', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning',
      }).then(() => {
        this.deleteScopeData(row);
      });
    },

    handleScopeConfirm() {
      const directoryName = this.newScopeRow["directoryName"]; // 当前点击行目录名称
      const tableName = this.newScopeRow["tableName"]; // 当前点击行table名称
      const scopeName = this.form.name;

      this.$refs["scopeForm"].validate(valid => {
        if (valid) {
          const newCustomList = [{
            ...this.tabs[directoryName][tableName],
            customList: undefined,
            customType: "new",
            scopeName: scopeName,
          }];

          // 更新tabs
          this.tabs = {
            ...this.tabs,
            [directoryName]: {
              ...this.tabs[directoryName],
              [tableName]: {
                ...this.tabs[directoryName][tableName],
                customList: this.tabs[directoryName][tableName]["customList"].concat(newCustomList),
              },
            },
          };

          this.setTableList(this.curTab);
          this.updateScopeData(newCustomList);
          this.handleScopeCancel();
        }
      });
    },

    handleScopeCancel() {
      this.newScopeRow = {};
      this.newScopeVisible = false;
      this.form = {};
      this.$refs["scopeForm"].resetFields();
    },

    // 更新数据
    updateScopeData(list = []) {
      const submit = {};
      const tables = {};
      list.forEach(item => {
        item.fields.forEach(filed => {
          submit[`${item.tableId}-${item.scopeName}-${filed.fieldId}`] = false;
        });
        tables[item.tableId] = {
          ...this.tables[item.tableId],
          [item.scopeName]: { ...item },
        };
      });
      this.submit = { ...this.submit, ...submit };
      this.tables = { ...this.tables, ...tables };
    },

    // 删除scope数据
    deleteScopeData(row) {
      const submit = { ...this.submit };
      // 需要删除的submit keys
      const keys = row.fields.map(field => `${row.tableId}-${row.scopeName}-${field.fieldId}`);
      keys.forEach(key => {
        Reflect.deleteProperty(submit, key);
      });
      // 删除scope对应的expression
      Reflect.deleteProperty(submit, `${row.tableId}-${row.scopeName}-expression`);

      const tabs = this.tabs;
      const directoryName = row["directoryName"];
      const tableName = row["tableName"];
      const customList = tabs[directoryName][tableName]["customList"];
      customList.splice(customList.findIndex(item => item.scopeName === row.scopeName), 1);

      this.submit = { ...submit };
      // 更新tabs
      this.tabs = {
        ...tabs,
        [directoryName]: {
          ...tabs[directoryName],
          [tableName]: {
            ...tabs[directoryName][tableName],
            customList,
          },
        },
      };
      this.setTableList(this.curTab);
    },

    validateNewScopeName(rules, value, callback) {
      if (rules.required && !value) {
        callback(new Error("请输入范围名称"));
        return;
      }

      const scopes = this.newScopeRow["scopes"];

      let isSame = false;
      // 判断名称是否存在
      for (let i = 0; i < scopes.length; i++) {
        if (scopes[i].scopeName === value) {
          isSame = true;
          break;
        }
      }

      if (isSame) {
        callback(new Error("范围名称已存在"));
      } else {
        callback();
      }
    },

    reset() {
      this.prevTableId = null; // tableId
      this.prevRowIndex = 0; // 合并Id
      this.concatRowNumber = 0; // 合并数量
      this.prevRowIndexs = [];
      this.concatRowNumbers = [];
    },
  },
};
</script>

<style lang="scss" scoped>
  .rules-header-wrapper {
    display: flex;
    .rules-header-item {
      flex: 20%;
      font-size: 12px;
      padding: 10px 0 10px 10px;
      border: 1px solid #EBEEF5;
      border-right: none;
      border-bottom: none;
      background: #F5F7FA;
      &:last-child {
        border-right: 1px solid #EBEEF5;
      }
    }
  }
  .rules-wrapper {
    .tables-wrapper {
      display: flex;
      font-size: 12px;
      .tables-item {
        flex: 20%;
        padding: 10px;
        border: 1px solid #EBEEF5;
        border-right: none;
        .el-checkbox__label {
          font-size: 12px;
        }
      }
    }

    // 范围样式
    .table-scope-wrapper {
      .table-scope-item {
        width: 50%;
      }
    }
  }
  // 刷新按钮
  .refbtn {
    margin-left: 1vh;
  }
</style>
