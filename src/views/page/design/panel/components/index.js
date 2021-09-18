// import Vue from "vue";
import { pageComponent } from "@/utils";
import PgInput from "./pageInput";
import PgTextarea from "./pageTextarea";
import PgButton from "./pageButton";
import PgTable from "./pageTable";
import PgSelect from "./pageSelect";
import PgForm from "./pageForm";
import PgDataSource from "./pageDataSource";
import PgPage from "./page";
import PgContainer from "./pageContainer";
import PgDialog from "./pageDialog";
import PgMemberSelector from "./pageMemberSelector";
import PgDepartmentSelector from "./pageDepartmentSelector";
import PgRadio from "./pageRadio";
import PgCheckbox from "./pageCheckbox";

// 页面生成组件注册
import WidgetRow from "@/views/page/design/widget/WidgetRow";
import WidgetForm from "@/views/page/design/widget/WidgetForm";
import WidgetItem from "@/views/page/design/widget/WidgetItem";
import WidgetContainer from "@/views/page/design/widget/WidgetContainer";
import WidgetDialog from "@/views/page/design/widget/WidgetDialog";

const defaultComponents = [
  PgInput,
  PgTextarea,
  PgButton,
  PgTable,
  PgSelect,
  PgForm,
  PgDataSource,
  PgPage,
  PgContainer,
  PgDialog,
  PgMemberSelector,
  PgDepartmentSelector,
  PgRadio,
  PgCheckbox,
  WidgetRow,
  WidgetForm,
  WidgetItem,
  WidgetContainer,
  WidgetDialog,
];

pageComponent.register(defaultComponents, "default");
