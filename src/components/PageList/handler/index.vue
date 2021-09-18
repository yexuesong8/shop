<template>
  <el-row class="page-table-columns-handler-box">
    <template v-for="(handler, handlerIndex) in handlers">
      <div v-if="getHandlerShow(handler)" :key="`handler-${handlerIndex}`" class="page-table-columns-handler" @click.stop>
        <component
          :is="getHandlerComponent(handler)"
          :data="data"
          :handler="handler"
          v-bind="getHandlerProps(handler)"
          v-on="getHandlerEvents(handler)"
        />
      </div>
    </template>
  </el-row>
</template>

<script>
import { _typeof } from "@monkey.do/monkey";
import DeleteHandler from "./delete";
import ButtonHandler from "./button";
import UpdateHandler from "./update";
import AuthButton from "@/components/AuthButton";

const components = {
  delete: DeleteHandler,
  button: ButtonHandler,
  update: UpdateHandler,
  "auth-button": AuthButton,
};

export default {
  name: "PageListHandler",
  inject: ["$pageList"],
  props: {
    handlers: {
      type: Array,
      default: () => [],
      required: true,
    },
    data: {
      type: null,
      required: true,
    },
  },
  data() {
    return {
    };
  },
  methods: {
    getHandlerComponent(handler) {
      return components[handler.type] || handler.type;
    },
    getHandlerShow(handler) {
      if (handler && Reflect.has(handler, 'show')) {
        if (_typeof(handler.show) === 'function') {
          return handler.show(this.data);
        } else {
          return handler.show;
        }
      }
      return true;
    },
    getHandlerProps(handler) {
      const newHandler = {
        ...handler,
        props: {
          ...handler.props,
          disabled: (handler.props || {}).disabled ? (_typeof(handler.props.disabled) === 'function' ? handler.props.disabled(this.data) : !!handler.props.disabled) : false,
        },
      };

      switch (newHandler.type) {
        case "delete":
          return {
            ...newHandler.props,
            row: this.data.row,
          };
        case "auth-button":
          return {
            ...newHandler.props,
            params: this.data.row,
          };
        default:
          return newHandler.props || {};
      }
    },
    getHandlerEvents(handler) {
      if (handler.type === 'delete') {
        return {
          ...handler.events,
          deleteSuccess: () => {
            if (handler.events && handler.events.deleteSuccess) handler.events.deleteSuccess();
            this.$pageList.refresh(1);
          },
        };
      }
      return handler.events || {};
    },
  },
};
</script>

<style lang="scss">
  .page-table-columns-handler-box {
    .page-table-columns-handler {
      display: inline-block;
      margin-right: 5px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
</style>
