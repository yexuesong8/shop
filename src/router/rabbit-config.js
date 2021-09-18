import User from "@/views/system/user/index";
import Role from "@/views/system/role/index";
import Menu from "@/views/system/menu/index";
import Interface from "@/views/system/interface/index";
import DataAuth from "@/views/system/authority/data/index";
import FieldAuth from "@/views/system/authority/field/index";
import Post from "@/views/system/post/index";
import Dept from "@/views/system/dept/index";
import DataBase from "@/views/data/database/index";
import Dict from "@/views/data/dict/index";
import Field from "@/views/data/field/index";
import Table from "@/views/data/table/index";
import Message from "@/views/data/message/index";
import MessageTemplate from "@/views/data/msgTemplate/index";
import AuthorityRules from "@/views/system/authority/rules/index";
import LoginLog from "@/views/log/login/index";
import OperationLog from "@/views/log/operation/index";
import WorkflowForm from "@/views/workflow/form/index";
import WorkflowType from "@/views/workflow/type/index";
import workflowTemplate from "@/views/workflow/template/index";
import Initiate from "@/views/workflow/instance/initiate";
import Pending from "@/views/workflow/instance/pending";
import Processed from "@/views/workflow/instance/processed";
import WorkFlowInstance from "@/views/workflow/instance/index";
import WorkflowMonitor from "@/views/workflow/instance/monitor";
import WorkflowCopySend from "@/views/workflow/instance/copySend";
import Notice from "@/views/notice/index.vue";
import ServiceStatus from "@/views/service/status";
import ServiceWarning from "@/views/service/warning";
import Report from "@/views/system/report/index";
import Preview from "@/views/system/report/preview/index";
import ReportRole from "@/views/system/report/authority/index";
import TableAuth from "@/views/authority/table";
import HomeTemplate from "@/views/home/template/index";
import HomeTemplateCreate from "@/views/home/template/create/index";
import HomeTemplateUpdate from "@/views/home/template/create/index";
import HomeDesign from "@/views/home/design/index";
import HomeComponent from "@/views/home/component/index";
import PropertiesType from "@/views/page/properties/type/index";
import PageMaking from "@/views/page/design/index";
import PageComponent from "@/views/page/component/index";
import PropertiesGroup from "@/views/page/properties/group/index";
import PageTemplate from "@/views/page/template/index";
import Parameter from "@/views/system/parameter/index";
import Black from "@/views/safety/black/index";
import White from "@/views/safety/white/index";
import Interfaces from "@/views/authority/interface/index";
import Classification from "@/views/authority/classification/index";
import Auth from "@/views/authority/auth/index";
import Data from "@/views/authority/data/index";
import AuthMode from "@/views/authority/authMode/index";
import DingTalk from "@/views/plugins/dingTalk";

// 组件路径作为key { componentPath: component }
const rabbitView = {
  "system/user/index": User,
  "system/report/index": Report,
  "system/report/preview/index": Preview,
  "system/report/authority/index": ReportRole,
  "system/role/index": Role,
  "system/menu/index": Menu,
  "system/interface/index": Interface,
  "system/post/index": Post,
  "system/dept/index": Dept,
  "system/database/index": DataBase,
  "data/dict/index": Dict,
  "data/field/index": Field,
  "data/table/index": Table,
  "data/message/index": Message,
  "data/msgTemplate/index": MessageTemplate,
  "system/authority/rules/index": AuthorityRules,
  "system/authority/data/index": DataAuth,
  "system/authority/field/index": FieldAuth,
  "log/login/index": LoginLog,
  "log/operation/index": OperationLog,
  "notice/index": Notice,
  "workflow/type/index": WorkflowType,
  "workflow/form/index": WorkflowForm,
  "workflow/template/index": workflowTemplate,
  "workflow/instance/initiate": Initiate,
  "workflow/instance/pending": Pending,
  "workflow/instance/processed": Processed,
  "workflow/instance/index": WorkFlowInstance,
  "workflow/instance/monitor": WorkflowMonitor,
  "workflow/instance/cc": WorkflowCopySend,
  "service/status": ServiceStatus,
  "service/warning": ServiceWarning,
  "authority/table/index": TableAuth,
  "home/template/index": HomeTemplate,
  "home/template/create": HomeTemplateCreate,
  "home/template/update": HomeTemplateUpdate,
  "home/design/index": HomeDesign,
  "home/component/index": HomeComponent,
  "page/properties/type/index": PropertiesType,
  "page/design/index": PageMaking,
  "page/component/index": PageComponent,
  "page/properties/group/index": PropertiesGroup,
  "page/template/index": PageTemplate,
  "system/parameter/index": Parameter,
  "safety/black/index": Black,
  "safety/white/index": White,
  "authority/interface/index": Interfaces,
  "authority/classification/index": Classification,
  "authority/auth/index": Auth,
  "authority/data/index": Data,
  "authority/authMode/index": AuthMode,
  'plugins/dingTalk': DingTalk,
};

export default rabbitView;
