<template>
  <Dialog :title="!$data.hasOwnProperty('id') ? '查看报表' : '查看单据'" :has-footer="false" :visible="visible" width="1000px" @cancel="cancel">
    <MainContainer class="rabbit-preview-container">
      <FilterSearch v-if="!$data.hasOwnProperty('id')" ref="filterSearch" :default-visible="true" class="mt10 mb20">
        <template v-slot:search>
          <component :is="component" :key="key" ref="form" :query-scheme="componentData" />
        </template>
        <template #actions>
          <el-form :model="form" label-width="auto">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="查询方案:">
                  <el-select v-model="plan" @change="handleChange">
                    <el-option v-for="item in querySchemeList" :key="item.id" :value="item.name" :label="item.name" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col class="flex-between" :span="12">
                <el-button type="primary" @click="handleSearch">查询</el-button>
                <el-button type="primary" @click="handleExport">导出</el-button>
                <el-button type="primary" @click="handlePrint">打印</el-button>
                <!-- <Printing
                  v-show="false"
                  ref="Printing"
                  container="printing-id"
                  :options="{
                    maxWidth: 1500,
                    targetStyles: ['*'],
                    ignoreElements: ['printing-ignore-1', 'printing-ignore-2', 'printing-ignore-3']
                  }"
                /> -->
              </el-col>
            </el-row>
          </el-form>
        </template>
      </FilterSearch>
      <div v-if="$data.hasOwnProperty('id')" class="btn">
        <el-button type="primary" @click="handleExport">导出</el-button>
        <el-button type="primary" @click="handlePrint">打印</el-button>
      </div>
      <!-- 分割线 -->
      <el-divider />
      <iframe class="iframe" width="100%" :src="url" frameborder="0" />
      <iframe
        v-show="false"
        id="printing-id"
        ref="printIframe"
        class="print-iframe"
        width="100%"
        scrolling="no"
        :src="url"
        frameborder="0"
        @load="calcPrintIframe()"
      />
    </MainContainer>
  </Dialog>
</template>

<script>
import { FilterSearch, Printing, getToken } from "@monkey.do/monkey";
import { getTemplateAll, getQueryScheme } from "@/api/system/report";
import { MainContainer } from "@/components";
import ErrorComponent from "./components/error";

import ExportType from "./export";
export default {
  name: "PreviewDetail",
  components: {
    FilterSearch,
    ErrorComponent,
    MainContainer,
    ExportType,
    Printing,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      templateId: "",
      form: {},
      plan: "",
      key: Math.random(),
      component: "",
      componentData: {},
      querySchemeList: [],
      url: "",
      params: {},
      token: "",
    };
  },
  created() {
    this.token = getToken();
    this.getTemplateId();
    if (!this.$data.hasOwnProperty('id')) return;
    this.params.parameter = encodeURI(JSON.stringify({ id: this.id }));
    this.url = `/api/v1/rabbit/report/jasper/show?token=${this.token}&code=${this.code}&parameter=${this.params.parameter}`;
  },
  methods: {
    // 获取templateId
    getTemplateId() {
      getTemplateAll({ code: this.code }).then(res => {
        if (res.statusCode === 600) {
          res.data.forEach(item => {
            if (item.code !== this.code) return;
            this.templateId = item.id;
          });
        }
        if (this.$data.hasOwnProperty('id')) return;
        this.handleQueryScheme();
      });
    },
    // 获取查询方案
    handleQueryScheme() {
      getQueryScheme({ templateId: this.templateId }).then(res => {
        if (res.statusCode === 600) {
          this.querySchemeList = res.data;
          this.querySchemeList.forEach(item => {
            if (item.isDefault === 1) {
              this.plan = item.name;
              this.handleChange(this.plan);
            }
          });
        }
      });
    },
    // 查找组件
    handleLoadView(path) {
      try {
        this.component = require(`@/views/dynamic/${path}`).default;
      } catch (err) {
        this.key = Math.random();
        this.component = ErrorComponent;
        throw new Error(`找不到对应路径的文件: /views/dynamic/${path}`);
      }
    },
    // 查询方案选择
    handleChange(val) {
      this.querySchemeList.forEach(item => {
        if (item.name !== val) return;
        this.componentData = item;
        this.handleLoadView(item.formSource);
      });
    },
    // 查询
    handleSearch() {
      if (this.$refs.form && !this.$refs.form.getData) {
        this.$doingConfirm({ title: '提示', message: '获取数据的方法getData不存在,请实现该方法', showCancelButton: false, confirmButtonText: '确定' });
        return;
      }
      if (!this.$refs.form) {
        this.params.parameter = encodeURI(JSON.stringify({}));
        this.url = `/api/v1/rabbit/report/jasper/show?token=${this.token}&templateId=${this.templateId}&parameter=${this.params.parameter}`;
        return;
      }
      this.form = this.$refs.form.getData();
      const obj = {};
      Object.keys(this.form).forEach(item => {
        if (this.form[item]) {
          obj[item] = this.form[item];
        }
      });
      this.params.parameter = encodeURI(JSON.stringify(obj));
      this.url = `/api/v1/rabbit/report/jasper/show?token=${this.token}&templateId=${this.templateId}&parameter=${this.params.parameter}`;
    },
    // 导出
    handleExport() {
      if (!this.url) {
        this.$doingConfirm({ title: '提示', message: '请先查询报表再导出', showCancelButton: false, confirmButtonText: '确定' });
        return;
      }
      const h = this.$createElement;
      this.$msgbox({
        title: '选择导出格式',
        message: h(ExportType, { ref: 'exportType', on: { 'change': this.exportTypeChange }}, []),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            if (this.params.hasOwnProperty('type')) {
              window.location.href = `/api/v1/rabbit/report/jasper/export?token=${this.token}&templateId=${this.templateId}&type=${this.params.type}&parameter=${this.params.parameter}`;
              done();
            } else {
              this.msgError("请选择导出文件类型");
            }
          } else {
            done();
          }
        },
      }).finally(() => {
        this.params = {};
        this.$refs.exportType.clean();
      });
    },
    // 导出类型选择
    exportTypeChange(val) {
      this.params = { ...this.params, type: val.type };
    },
    // 打印
    handlePrint() {
      if (!this.url) {
        this.$doingConfirm({ title: '提示', message: '请先查询报表再打印', showCancelButton: false, confirmButtonText: '确定' });
        return;
      }
      const ifm = document.getElementById("printing-id").contentWindow;
      ifm.print();
      // this.$refs.Printing.handlePrinting();
    },
    // 计算打印iframe高度
    calcPrintIframe() {
      const ifm = document.getElementById("printing-id").contentWindow;
      document.getElementById("printing-id").height = ifm.document.body.offsetHeight;
    },
    // 关闭弹窗
    cancel() {
      this.url = "";
      this.$emit("update:visible", false);
    },
  },
};
</script>

<style lang="scss" scoped>
.rabbit-preview-container{
  .form-container {
    display: flex;
    flex-wrap: wrap;
    .form-container-item {
      width: 20%;
    }
  }
  .iframe {
    height: calc(100vh - 90px - 24px - 30px - 92px - 50px);
  }
  .btn {
    display: flex;
    justify-content: flex-end;
  }
}
</style>

