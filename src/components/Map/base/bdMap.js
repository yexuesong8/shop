import { Tile as TileLayer } from "ol/layer";
import * as proj from "ol/proj";
import projzh from "projzh";
import XYZ from "ol/source/XYZ";
import TileGrid from "ol/tilegrid/TileGrid";

export function createBDMapLayer(options = {}) {
  // https://github.com/openlayers/openlayers/issues/3522
  // map.getView().setConstrainResolution(true);

  var bd09Extent = [-20037726.37, -12474104.17, 20037726.37, 12474104.17];
  var baiduMercator = new proj.Projection({
    code: "baidu",
    extent: bd09Extent,
    units: "m",
  });

  proj.addProjection(baiduMercator);

  proj.addCoordinateTransforms(
    "EPSG:4326",
    baiduMercator,
    projzh.ll2bmerc,
    projzh.bmerc2ll
  );

  proj.addCoordinateTransforms(
    "EPSG:3857",
    baiduMercator,
    projzh.smerc2bmerc,
    projzh.bmerc2smerc
  );

  var bmercResolutions = new Array(19);
  for (var i = 0; i < 19; ++i) {
    bmercResolutions[i] = Math.pow(2, 18 - i);
  }

  var baiduSource = new XYZ({
    projection: "baidu",
    wrapX: true,
    url: "http://maponline{0-3}.bdimg.com/tile/?qt=vtile&x={x}&y={y}&z={z}&styles=pl&scaler=2&udt=20191119",
    tileGrid: new TileGrid({
      minZoom: 3,
      resolutions: bmercResolutions,
      origin: [0, 0],
      extent: bd09Extent,
      // tileSize: [512,512],
    }),
  });

  const xyzTileUrlFunction = baiduSource.getTileUrlFunction();
  const tmsTileUrlFunction = function([z, x, y]) {
    return xyzTileUrlFunction([z, x, -y - 1]);
  };
  baiduSource.setTileUrlFunction(tmsTileUrlFunction);

  return new TileLayer({
    source: baiduSource,
    zIndex: options.zIndex || 1,
  });
}
