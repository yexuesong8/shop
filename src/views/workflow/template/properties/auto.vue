<template>
  <el-form ref="form" v-model="form" label-width="auto">
    <el-form-item label="名称" prop="name">
      <el-input v-model.trim="form.name" :maxlength="50" @input="handleNameInput" />
    </el-form-item>
    <el-collapse v-model="activeNames">
      <TaskProperty :value="form.taskList" @change="handleTaskChange" />
    </el-collapse>
  </el-form>
</template>

<script>
import TaskProperty from "./property/task";
import { mapState } from "vuex";

export default {
  name: "AutoNodeProperties",
  components: { TaskProperty },
  props: {
    defaultValue: {
      type: Object,
      default: () => ({}),
    },
    modeler: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      activeNames: [],
      form: {
        isAutoNode: true,
      },
    };
  },
  computed: {
    ...mapState("workflow", {
      element: state => state.element,
    }),
  },
  watch: {
    form: {
      handler: function(value) {
        value.name = value.name === "结束0" ? "结束" : value.name;
        this.setData(value);
      },
      deep: true,
    },
  },
  mounted() {
    this.form = { isAutoNode: true, ...this.defaultValue };
  },
  methods: {
    handleTaskChange(taskList) {
      this.form = { ...this.form, taskList };
    },
    handleNameInput(e) {
      if (this.element) {
        this.modeler.get("modeling").updateProperties(this.element, {
          name: e,
        });
      }
    },
    setData(value) {
      this.$store.commit("workflow/setData", value);
    },
    reset() {
      this.$refs["form"].resetFields();
    },
  },
};
</script>
