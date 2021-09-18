import { createTdMapLayer } from "./tdMap";
import { createAMapLayer } from "./aMap";
import { createBDMapLayer } from "./bdMap";
import { MapType } from "../config";

export function createMapLayer(mapType, options) {
  let mapLayer = null;

  switch (mapType) {
    case MapType['TDMap']:
      mapLayer = createTdMapLayer(options);
      break;
    case MapType['AMap']:
      mapLayer = createAMapLayer(options);
      break;
    case MapType["BDMap"]:
      mapLayer = createBDMapLayer(options);
      break;
    default:break;
  }

  return mapLayer;
}

export function createMapLabelLayer(mapType, options = {}) {
  let labelLayer = null;

  switch (mapType) {
    case MapType['TDMap']:
      labelLayer = createTdMapLayer({ type: 4, ...options });
      break;
    case MapType['AMap']:
      labelLayer = createAMapLayer(options);
      break;
    case MapType["BDMap"]:
      labelLayer = createBDMapLayer(options);
      break;
    default:break;
  }

  return labelLayer;
}

export function createMapPhotographicLayer(mapType, options = {}) {
  let photographicLayer = null;

  switch (mapType) {
    case MapType['TDMap']:
      photographicLayer = createTdMapLayer({ type: 2, ...options });
      break;
    case MapType['AMap']:
      photographicLayer = createAMapLayer(options);
      break;
    case MapType["BDMap"]:
      photographicLayer = createBDMapLayer(options);
      break;
    default:break;
  }

  return photographicLayer;
}

const Methods = [
  { key: "createLabelLayer", value: createMapLabelLayer },
  { key: "createPhotographicLayer", value: createMapPhotographicLayer },
];

export default class BaseMap {
  constructor({ type }) {
    this.type = type;

    this._bindMethods();
  }

  create(options) {
    return createMapLayer(this.type, options);
  }

  _bindMethods() {
    Methods.forEach(method => {
      this[method.key] = (options) => method.value(this.type, options);
    });
  }
}
