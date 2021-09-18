import XYZ from "ol/source/XYZ";
// import * as proj from "ol/proj";
// import * as olExtent from 'ol/extent';
// import projzh from "projzh";
import TileGrid from "ol/tilegrid/TileGrid";
import { Tile as TileLayer } from "ol/layer";
import { gcj02mc, proj } from "../gcj02";

// https://github.com/openlayers/openlayers/issues/9146
// https://jsfiddle.net/tjrnu8yd/
export function createAMapLayer(options = { type: 1, layerName: "AMap" }) {
  // const mc2gcj02mc = function(input, opt_output, opt_dimension) {
  //   var output = projzh.projection.sphericalMercator.inverse(input, opt_output, opt_dimension);
  //   output = projzh.datum.gcj02.fromWGS84(output, output, opt_dimension);
  //   return projzh.projection.sphericalMercator.forward(output, output, opt_dimension);
  // };

  // const gcj02mc2mc = function(input, opt_output, opt_dimension) {
  //   var output = projzh.projection.sphericalMercator.inverse(input, opt_output, opt_dimension);
  //   output = projzh.datum.gcj02.toWGS84(output, output, opt_dimension);
  //   return projzh.projection.sphericalMercator.forward(output, output, opt_dimension);
  // };

  // const gcj02mc2ll = function(input, opt_output, opt_dimension) {
  //   var output = projzh.projection.sphericalMercator.inverse(input, opt_output, opt_dimension);
  //   return projzh.datum.gcj02.toWGS84(output, output, opt_dimension);
  // };

  // const ll2gcj02mc = function(input, opt_output, opt_dimension) {
  //   var output = projzh.datum.gcj02.fromWGS84(input, opt_output, opt_dimension);
  //   return projzh.projection.sphericalMercator.forward(output, output, opt_dimension);
  // };

  // const gcj02mc = new proj.Projection({
  //   code: 'GCJ02MC',
  //   extent: olExtent.applyTransform([-180, -90, 180, 90], ll2gcj02mc),
  //   units: 'm',
  // });

  // proj.addProjection(gcj02mc);
  // proj.addCoordinateTransforms('EPSG:4326', gcj02mc, ll2gcj02mc, gcj02mc2ll);
  // proj.addCoordinateTransforms('EPSG:3857', gcj02mc, mc2gcj02mc, gcj02mc2mc);

  const resolutions = [];
  for (let i = 0; i < 19; i++) {
    resolutions[i] = Math.pow(2, 18 - i) * 0.5971642833948135;
  }

  let url = "";
  switch (options.type) {
    case 1:
      url = "http://webrd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}";
      break;
    case 2:
      url = "http://webrd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=2&style=8&x={x}&y={y}&z={z}";
      break;
    case 3:
      url = "http://webst0{1-4}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}";
      break;
    default:
      break;
  }

  return new TileLayer({
    layerName: options.layerName,
    zIndex: options.zIndex || 1,
    source: new XYZ({
      url,
      projection: gcj02mc,
      maxZoom: 18,
      tileGrid: new TileGrid({
        origin: [-20037508.342789244, 20037508.34278071],
        minZoom: 3,
        tileSize: [256, 256],
        extent: proj.transformExtent([-180, -90, 180, 90], 'EPSG:4326', 'GCJ02MC'),
        resolutions: resolutions,
      }),
    }),
  });
}
