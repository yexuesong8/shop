import Vue from "vue";

export declare class RenderComponent extends Vue {
  /** 组件路径 */
  path: string;
  /** 组件加载方法 */
  loadView?: Function;
}
