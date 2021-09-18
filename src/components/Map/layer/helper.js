import OlLayer from 'ol/layer/Layer';
import { isArray } from "@monkey.do/monkey";

export function createLayer(options) {
  return new OlLayer(options);
}

export function addLayer(layer, map) {
  if (isArray(layer)) {
    layer.forEach(lay => {
      map.addLayer(lay);
    });
  } else {
    map.addLayer(layer);
  }
}

export function removeLayer(layer, map) {
  if (isArray(layer)) {
    layer.forEach(lay => {
      map.removeLayer(lay);
    });
  } else {
    map.removeLayer(layer);
  }
}

export function hideLayer(layer) {
  layer.setVisible(false);
}

export function showLayer(layer) {
  layer.setVisible(true);
}
