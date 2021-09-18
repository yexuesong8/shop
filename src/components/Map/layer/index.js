import { createLayer, addLayer, removeLayer, hideLayer, showLayer } from "./helper";
import { createWMSLineLayer, createWMSPointLayer } from "./wms";
import { createHeatMapLayer } from "./heat-map";

const methods = [
  { key: "createWMSLineLayer", value: createWMSLineLayer },
  { key: "createWMSPointLayer", value: createWMSPointLayer },
  { key: "createHeatMapLayer", value: createHeatMapLayer },
];

class Layer {
  constructor(map) {
    this.map = map;

    this._bindMethods();
  }

  create(options) {
    return createLayer(options);
  }

  add(layer) {
    addLayer(layer, this.map);
  }

  remove(layer) {
    removeLayer(layer, this.map);
  }

  hide(layer) {
    hideLayer(layer);
  }

  show(layer) {
    showLayer(layer);
  }

  _bindMethods() {
    methods.forEach(method => {
      this[method["key"]] = method["value"];
    });
  }
}

export default Layer;
