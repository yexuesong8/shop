<template>
  <span :key="detail.id" class="check-form">
    <slot :click="handleClick" />
    <Dialog title="流程表单" :visible="visible" :loading="loading" @cancel="handleCancel" @confirm="handleConfirm">
      <el-row :gutter="8">
        <el-col :span="1.5">
          <template-detail :id="detail.id">
            <template v-slot:default="slot">
              <el-button type="primary" @click="slot.click">查看流程详情</el-button>
            </template>
          </template-detail>
        </el-col>
        <el-col v-for="(button, index) in buttons" :key="index" :span="1.5">
          <map-jump v-if="button.type === 'jump' || button.type === 'retreat'" :id="detail.id" :detail="detail" :type="button.type" @close="handleCancel">
            <template v-slot:default="viewer">
              <el-button :type="button.buttonType || 'primary'" @click="viewer.click">
                {{ button.name }}
              </el-button>
            </template>
          </map-jump>
          <el-button v-else v-show="setCondition(button, detail)" :type="button.buttonType || 'primary'" @click="buttonMethod(button.type, detail)">
            {{ button.name }}
          </el-button>
        </el-col>
      </el-row>
      <el-row class="mt20">
        <render-component :path="componentPath" />
      </el-row>
    </Dialog>
  </span>
</template>

<script>
import TemplateDetail from "./detail";
import { getButtons, buttons } from "../config";
import { getPendingButtons, getIns } from "@/api/workflow/instance";
import { getForm } from "@/api/workflow/form";
import MapJump from "./map-jump";
import { RenderComponent } from "@/components";

export default {
  name: "Form",
  components: { TemplateDetail, MapJump, RenderComponent },
  props: {
    detail: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    buttonMethod: {
      type: Function,
      default: () => { },
    },
    formVisible: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      loading: false,
      visible: false,
      buttons: [],
      ins: {},
      componentPath: "",
    };
  },
  watch: {
    visible: {
      handler(value) {
        if (value) {
          if (this.type === "pending") {
            getPendingButtons({ instanceId: this.detail.id, stateId: this.detail.stateId }).then(res => {
              if (res.statusCode === 600) {
                this.buttons = getButtons(res.data);
              }
            });
          }

          if (this.type === "initiate" || this.type === "monitor") {
            this.buttons = buttons[this.type];
          }
        }
      },
    },
    formVisible: {
      handler(val) {
        this.visible = val;
      },
      immediate: true,
      deep: true,
    },
    id: {
      handler(val) {
        if (val) this.handleClick();
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    // 获取instance详情
    async getIns(data) {
      const res = await getIns({ id: this.detail.id, ...data });
      if (res.statusCode === 600) this.ins = res.data;
      return res.data;
    },
    // 获取instance对应form详情
    async getForm() {
      const data = await this.getIns();
      // let obj = {};
      // if (this.id) {
      //   obj = { id: data.formId, instanceId: this.id };
      // } else {
      //   obj = { id: data.formId };
      // }
      const result = await getForm({ id: data.formId });
      if (result.statusCode === 600) {
        // this.componentPath = result.data.path;
      }
    },
    handleClick() {
      this.visible = true;
      this.getForm();
    },
    handleConfirm() {
      this.handleCancel();
    },
    handleCancel() {
      this.visible = false;
      this.$emit("cancle", this.visible);
    },
    cancel() {
      this.visible = false;
    },
    setCondition(item, row) {
      let res = true;
      // 条件目前只支持并且
      const keys = Object.keys(item.condition || {});
      for (let i = 0; i < keys.length; i++) {
        if (row[keys[i]] !== item.condition[keys[i]]) {
          res = false;
          return false;
        }
        res = row.i === item.condition[i];
      }
      return res;
    },
  },
};
</script>
