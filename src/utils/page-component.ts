interface PageComponent {
  register: (component: any[]) => void;
  getComponents: () => any[];
  getRegisterComponents: () => any[];
  getDefaultComponents: () => any[];
}

export declare const pageComponent: PageComponent;
