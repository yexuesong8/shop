import Vue from "vue";

export declare class Table extends Vue {
  /** Install component into Vue */
  static install (vue: typeof Vue): void
  /** 接口地址 */
  api: string;
  /** 请求参数 */
  params?: object;
}
