<template>
  <component :is="getComponent(component)" v-if="data.trim || data.trim === undefined" v-model.trim="model" :scope="scope" :form="form" :prop="prop" :data="form" v-bind="getComponentProps(component)" v-on="getComponentEvents(component)" />
  <component :is="getComponent(component)" v-else v-model="model" :scope="scope" :data="form" :form="form" :prop="prop" v-bind="getComponentProps(component)" v-on="getComponentEvents(component)" />
</template>

<script>
import FormItemComponent from "@/components/FormItem/component/component.js";
import Props from "@/components/FormItem/component/props";

export default {
  name: "FormItemComponent",
  mixins: [Props],
  props: {
    scope: {
      type: Object,
      default: () => ({}),
    },
  },
  inject: {
    $pageFindForm: {
      default: null,
    },
  },
  computed: {
    model: {
      get() {
        if (this.component.name === 'date-time-picker') return this.form;
        return this.form[this.prop];
      },
      set(value) {
        if (this.component.name === 'date-time-picker') {
          Object.keys(value).forEach(key => {
            this.$set(this.form, key, value[key]);
          });
        } else if (this.component.name === 'member-selector') {
          this.$set(this.form, this.prop, this.formatter(value));
        } else {
          this.$set(this.form, this.prop, value);
        }
      },
    },
  },
  mounted() {
    // input框支持回车查询
    if (this.component.name === 'el-input') {
      this.$el.addEventListener("keyup", (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (e.keyCode === 13 && this.$pageFindForm) {
          this.$pageFindForm.search();
        }
      }, null);
    }
  },
  methods: {
    setFormValue(key, value) {
      this.$set(this.form, key, value);
    },
    getComponent(component) {
      return new FormItemComponent(component).getComponent();
    },
    getComponentProps(component) {
      if (component.name === 'el-input') {
        return {
          // 默认最大长度为30
          maxlength: 30,
          ...(component.props || {}),
        };
      }
      return component.props || {};
    },
    getComponentEvents(component) {
      if (component.isNeedInstance) {
        const self = this;
        const events = {};
        Object.keys((component.events || {})).forEach(key => {
          const event = component.events[key];
          events[key] = function(...args) {
            const newArgs = [
              {
                self: self,
                setFormValue: self.setFormValue,
                scope: self.scope,
              },
              ...args,
            ];
            event(...newArgs);
          };
        });
        return events;
      }
      return component.events || {};
    },
  },
};
</script>
