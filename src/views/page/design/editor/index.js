import { pageEditor } from "@/utils";
import InputEditor from "./input-editor";
import InputEditorMore from "./input-editor-more";
import MarginPaddingEditor from "./margin-padding-editor";
import TextareaEditor from "./textarea-editor";
import SwitchEditor from "./switch-editor";
import RadioGroupEditor from "./radio-group-editor";
import SelectEditor from "./select-editor";
import TableOptions from "./table-options";
import ColumnEditor from "./column-editor";
import TableActions from "./table-actions";
import PageColumnsEditor from "./page-columns-editor";
import CodeEditor from "./code-editor";

const defaultEditor = [
  InputEditor,
  InputEditorMore,
  MarginPaddingEditor,
  TextareaEditor,
  SwitchEditor,
  RadioGroupEditor,
  SelectEditor,
  TableOptions,
  ColumnEditor,
  TableActions,
  PageColumnsEditor,
  CodeEditor,
];

pageEditor.register(defaultEditor);
