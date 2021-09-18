interface InstallOption {
  store?: object,
  routes?: any[],
  getter?: object,
  loadView?: Function,
  routeHandler?: Function,
}

declare function install(object: InstallOption): void;
export { install };
export * from "./components/index";
export * from "./utils/index";
export * from "./layout/index";
export * from "./config/index";
