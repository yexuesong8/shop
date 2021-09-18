import WorkflowInitiate from "@/views/workflow/instance/initiate.vue";
import WorkflowMonitor from "@/views/workflow/instance/monitor.vue";
import WorkflowPending from "@/views/workflow/instance/pending.vue";
import WorkflowProcessed from "@/views/workflow/instance/processed.vue";
import WorkflowCopySend from "@/views/workflow/instance/copySend.vue";
import WorkflowTemplate from "@/views/workflow/template/index.vue";
import WorkflowForm from "@/views/workflow/form/index";
import WorkflowType from "@/views/workflow/type/index";
import { store } from "@/entry/lib";
import workflowStore from "@/store/modules/workflow/index";
const routes = require("./routes.json");
const version = require("../../../../package").version;

const components = [
  WorkflowType,
  WorkflowInitiate,
  WorkflowMonitor,
  WorkflowPending,
  WorkflowProcessed,
  WorkflowTemplate,
  WorkflowForm,
  WorkflowCopySend,
];

const install = function(Vue) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

if (window.loader) {
  window.loader.installPluginRoute("rabbit", "workflow", routes);
  window.loader.loadPluginStyle("rabbit", "workflow", `v${version}`);
}

store.registerModule("workflow", workflowStore);

export default {
  install,
  WorkflowType,
  WorkflowInitiate,
  WorkflowMonitor,
  WorkflowPending,
  WorkflowProcessed,
  WorkflowTemplate,
  WorkflowForm,
  WorkflowCopySend,
};
