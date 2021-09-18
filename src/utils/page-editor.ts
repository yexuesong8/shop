interface PageEditor {
  register: (component: any[]) => void;
  getEditors: () => any[];
  getDefaultEditors: () => any[];
  getRegisterEditors: () => any[];
}

export declare const pageEditor: PageEditor;
