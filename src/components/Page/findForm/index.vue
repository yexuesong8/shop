<template>
  <div class="page-find-form-container">
    <el-form
      v-if="hasFilter"
      ref="form"
      :model="modelForm"
      v-bind="formProps"
      :class="$scopedSlots.search ? 'no-margin' : ''"
      v-on="form.events"
      @submit.native.prevent
    >
      <FilterSearch @change="handleFilterSearchChange">
        <template v-slot:tools>
          <slot name="tools" :search="search" :reset="reset" :form="modelForm" :loading="loading" />
        </template>
        <template v-slot:search>
          <el-row class="mt10">
            <slot v-if="$scopedSlots.search" name="search" :search="search" :reset="reset" :form="modelForm" :loading="loading" />
            <FormItems v-else :items="form.items" :form="modelForm" :loading="loading" :search="search" :reset="reset" />
          </el-row>
        </template>
      </FilterSearch>
    </el-form>
    <el-form
      v-else
      ref="form"
      :model="modelForm"
      v-bind="formProps"
      :class="$scopedSlots.search ? 'no-margin' : ''"
      v-on="form.events"
      @submit.native.prevent
    >
      <slot v-if="$scopedSlots.search" name="search" :search="search" :reset="reset" :form="modelForm" :loading="loading" />
      <FormItems v-else :items="form.items" :form="modelForm" :loading="loading" :search="search" :reset="reset" />
    </el-form>
  </div>
</template>

<script>
import { FilterSearch, isEmptyObject, isArray } from "@monkey.do/monkey";
import FormItems from "@/components/FormItems";
import mixProps from "./props";

export default {
  name: "PageFindForm",
  components: { FilterSearch, FormItems },
  mixins: [mixProps],
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    form: {
      type: Object,
      default: () => ({
        events: {},
        props: {},
        items: [],
      }),
    },
    params: {
      type: Object,
      default: () => ({}),
    },
    defaultParams: {
      type: Object,
      default: () => ({}),
    },
  },
  provide() {
    return {
      $pageFindForm: this,
    };
  },
  inject: {
    $fixTable: {
      default: null,
    },
  },
  data() {
    return {
      modelForm: {},
    };
  },
  computed: {
    formProps() {
      return {
        "label-width": "auto",
        ...this.form.props,
      };
    },
  },
  watch: {
    defaultParams: {
      handler(val) {
        if (!isEmptyObject(val)) {
          this.modelForm = { ...this.modelForm, ...val };
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    search() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.$emit("search", this.searchParamsFormatter({ ...this.modelForm }));
        }
      });
    },
    reset() {
      this.modelForm = { ...this.defaultParams };
      this.$refs["form"].resetFields();
      this.$emit("reset");
    },
    getModelForm() {
      return this.searchParamsFormatter(this.modelForm);
    },
    resetModelForm() {
      this.modelForm = {};
    },
    setModleFormValue(value) {
      if (isArray(value)) {
        value.forEach(item => {
          if (item["prop"]) {
            this.modelForm[item["prop"]] = item["value"];
          }
        });
      } else {
        this.modelForm[value["prop"]] = value["value"];
      }
    },
    getFormInstance() {
      return this.$refs["form"];
    },
    handleFilterSearchChange() {
      if (this.$fixTable) {
        this.$nextTick(() => {
          this.$fixTable.trigger();
        });
      }
    },
  },
};
</script>

<style lang="scss">
.page-find-form-container {
  .monkey-radio-group-selector {
    vertical-align: top;
  }
}
</style>
