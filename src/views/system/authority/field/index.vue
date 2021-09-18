<template>
  <el-row class="main-content-container">
    <el-row class="mb20">
      <TypeSelection class="fl" :on-change="handleOnChange" :default-value="defaultTabId" :data="typeSelectionData" />
      <el-button class="fr" type="primary" :loading="loading" @click="handleSave">保存</el-button>
    </el-row>
    <div class="fields-box">
      <div class="fields-wrapper">
        <div v-for="(item, index) in curFieldList" :key="index" class="fields-item clearfix" :style="{minWidth: `${item.fieldInfoList.length * 150 + 100 + 2}px`}">
          <div class="title fl">{{ item.tableName }}</div>
          <div class="fields-list-wrapper fl">
            <div v-for="field in item.fieldInfoList" :key="field.fieldId + field.fieldName" class="fields-list-item">
              <div class="field-name">{{ field.fieldName }}</div>
              <div class="checkbox-box">
                <el-checkbox v-model="submit[`${item.tableId}-${field.fieldId}-1`]" label="查看" :value="field.fieldId" />
                <el-checkbox v-model="submit[`${item.tableId}-${field.fieldId}-2`]" label="修改" :value="field.fieldId" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-row>
</template>

<script>
// import { TypeSelection } from "@monkey.do/monkey";
import { fetch, save } from "@/api/system/authority/field";

export default {
  name: "FieldAuth",

  // components: { TypeSelection },

  data() {
    return {
      data: {
        tabs: [],
        tables: [],
        fields: {
        },
      },
      curTab: "",
      defaultTabId: null,
      submit: {
      },
      roleId: "",
      loading: false,
    };
  },

  computed: {
    typeSelectionData() {
      return this.data.tabs.map((item, index) => ({ id: index, name: item }));
    },

    curFieldList() {
      return this.data.fields[this.curTab] || [];
    },
  },

  watch: {
    typeSelectionData: {
      handler: function() {
        this.defaultTabId = 0;
      },
    },
  },

  mounted() {
    const { params: { roleId }} = this.$route;
    this.roleId = roleId;
    fetch({}, { roleId }).then(res => {
      if (res.statusCode === 600) {
        this.dataFormatter(res.data);
      }
    });
  },

  methods: {
    dataFormatter(data) {
      const tabs = [];
      const fields = {};
      const tables = [];
      const submit = {};

      data.forEach(item => {
        // 设置数据
        if (tabs.indexOf(item["directoryName"]) === -1) {
          tabs.push(item["directoryName"]);
          fields[item["directoryName"]] = [item];
        } else {
          fields[item["directoryName"]].push(item);
        }
        if (tables.indexOf(item.tableId) !== -1) tables.push(item.tableId);

        // 设置选中内容
        item.fieldInfoList.forEach(field => {
          if (field.actionType) {
            submit[`${item["tableId"]}-${field.fieldId}-${field.actionType}`] = true;
          }
        });
      });

      this.data = { ...this.data, tabs, fields };
      this.submit = { ...this.submit, ...submit };
      this.curTab = tabs[0];
    },

    handleOnChange(value) {
      this.curTab = value.name;
    },

    handleSave() {
      const storeData = {};
      const keys = Object.keys(this.submit);

      keys.forEach(key => {
        if (this.submit[key]) { // 去掉false 未勾选的
          const arr = key.split("-");
          const tableId = arr[0];
          const fieldId = arr[1];
          const type = arr[2];

          if (storeData[tableId] && storeData[tableId][fieldId]) {
            storeData[tableId][fieldId] = "2"; // 只要存在则取2
          } else {
            if (!storeData[tableId]) storeData[tableId] = {};
            storeData[tableId][fieldId] = type;
          }
        }
      });

      const payload = Object.keys(storeData).map(key => {
        const fields = Object.keys(storeData[key]).map(fieldId => ({
          fieldId,
          actionType: storeData[key][fieldId],
        }));

        return {
          tableId: key,
          fieldInfoList: fields,
        };
      });

      // 不存在数据
      if (!payload.length) return;

      this.loading = true;
      save(payload, { roleId: this.roleId }).then(res => {
        this.loading = false;
        if (res.statusCode === 600) {
          this.$message.success("保存成功");
        } else {
          this.$message.error(res.message);
        }
      });
    },
  },

};
</script>

<style lang="scss">
  .fields-wrapper {
    overflow-x: auto;
    .fields-item {
      height: 60px;
      border: 1px solid #EBEEF5;
      border-bottom: none;
      font-size: 12px;
      white-space: nowrap;
      &:last-child {
        border-bottom: 1px solid #EBEEF5;
      }
      .title {
        width: 100px;
        padding-left: 10px;
        border-right: 1px solid #EBEEF5;
        line-height: 60px;
      }

      .fields-list-item {
        display: inline-block;
        width: 150px;
        height: 60px;
        border-right: 1px solid #EBEEF5;
        .field-name {
          height: 30px;
          padding-left: 10px;
          line-height: 30px;
          border-bottom: 1px solid #EBEEF5;
          color: #333;
        }
        .checkbox-box {
          height: 30px;
          padding: 0 10px;
          line-height: 30px;
          .el-checkbox {
            margin-right: 10px;
          }
          .el-checkbox__label {
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
