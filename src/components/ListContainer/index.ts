import Vue from "vue";

export declare class ListContainer extends Vue {
  /** table props */
  tableProps?: object;
  /** form表单 props */
  formProps?: object;
  /** 接口地址 */
  api: string;
  /** 查询参数 */
  params?: object;
}
