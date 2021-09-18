import Vue from "vue";

type Property = {
  id: string;
  name: string;
}

export declare class FormItemSelectButton extends Vue {
  value?: any;
  disabled?: boolean;
  multiple?:boolean;
  property?: Property;
}
