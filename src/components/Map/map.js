import Map from "ol/Map";
import View from "ol/View";
// import { MapEvents } from "./config";
// import { createOverlay, addOverlay, addOverlays, removeOverlay, removeOverlays } from "./overlay";

export function createMap(options) {
  return new Map({
    target: "map",
    layers: [baseMapLayer, WMSLineLayer, WMSPointLayer],
    // layers: [baseMapLayer],
    view: new View({
      center: this.getCoord(this.defaultCenter),
      // center: fromLonLat([120.32714457090765, 30.30569628128095]),
      projection: this.getProjection(this.mapType),
      zoom: 15,
      multiWorld: false,
    }),
  });
}
