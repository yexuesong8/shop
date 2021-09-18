<template>
  <el-row v-if="!!(items || []).length" class="rabbit-form-item-box" :gutter="24">
    <template v-for="(item, index) in items">
      <el-row v-if="isArray(item)" :key="`form-item-${index}`" :gutter="24" style="padding: 0 12px;">
        <el-col v-for="(subItem, subIndex) in item" :key="`form-item-${subIndex}`" :span="subItem.span || 6">
          <FormItem v-if="!subItem.hide" :form="form" :data="subItem" :component="getComponent(subItem.component)" :props="getItemProps(subItem)" :events="getItemEvents(subItem)" />
        </el-col>
      </el-row>
      <el-col v-else :key="`form-item-${index}`" :span="item.span || 6">
        <FormItem v-if="!item.hide" :form="form" :data="item" :component="getComponent(item.component)" :props="getItemProps(item)" :events="getItemEvents(item)" />
      </el-col>
    </template>
  </el-row>
</template>

<script>
import { isArray } from "@monkey.do/monkey";
import FormItem from "@/components/FormItem";

export default {
  name: "FormItems",
  components: { FormItem },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    form: {
      type: Object,
      default: () => ({}),
    },
    loading: {
      type: Boolean,
      default: false,
    },
    search: {
      type: Function,
      default: () => {},
    },
    reset: {
      type: Function,
      default: () => {},
    },
  },
  methods: {
    isArray,
    getItemProps(item) {
      return item.props || {};
    },
    getItemEvents(item) {
      return item.events || {};
    },
    getComponent(component) {
      // 查询表单的查询按钮、重置按钮
      if (component.name === "button") {
        return this.getButtonProps(component);
      }
      return component;
    },
    getButtonProps(component) {
      return {
        ...component,
        props: {
          ...(component.props || {}),
          loading: this.loading,
          search: this.search,
          reset: this.reset,
        },
      };
    },
  },
};
</script>
