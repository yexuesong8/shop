import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';

export const TDMapToken = "d5b292da467b07f85eae0e869b862984";

export const MapType = {
  "TDMap": "TDMap",
  "AMap": "AMap",
  "BDMap": "BDMap",
};

export const MapEvents = [
  "click", "dbclick", "error",
  "moveend", "movestart", "pointerdrag", "pointermove",
  "postcompose", "postrender", "precompose", "propertychange",
  "rendercomplete", "singleclick", "contextmenu",
];

export const SelfCustomMapEvents = ['zoom', 'zoomin', 'zoomout'];

export const LayerIndex = {
  "baseLayer": 0, // 电子底图
  "rasterLayer": 1, // 影像
  "labelLayer": 2, // 注记
  "wmsLineLayer": 3,
};

export const HighLightStyle = new Style({
  fill: new Fill({
    color: 'rgba(255,255,255,0.7)',
  }),
  stroke: new Stroke({
    color: '#3399CC',
    width: 3,
  }),
});

export const DrawStyle = new Style({
  fill: new Fill({
    color: "#f44336",
  }),
  stroke: new Stroke({
    color: "#ffcc33",
    width: 2,
  }),
  image: new CircleStyle({
    radius: 7,
    fill: new Fill({
      color: "#ffcc33",
    }),
  }),
});
