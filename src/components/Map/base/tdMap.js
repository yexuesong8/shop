import { TDMapToken } from "../config";
import XYZ from "ol/source/XYZ";
import { Tile as TileLayer } from "ol/layer";
import { getProjectionByMapType } from "../utils/utils";

const ONLINE_URL = {
  "1": `http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=${TDMapToken}`,
  "2": `http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=${TDMapToken}`,
  "3": `http://t0.tianditu.com/DataServer?T=ter_w&x={x}&y={y}&l={z}&tk=${TDMapToken}`,
  "4": `http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=${TDMapToken}`,
};

export function createTdMapLayer(options = {}) {
  const _options = Object.assign({}, {
    type: 1,
    layerName: "TDMap",
    mode: "online",
    XYZUrl: "",
  }, options);

  if (_options.mode === "offline" && !_options.XYZUrl) {
    console.error("[rabbit-map]: 请传入离线地图接口地址 XYZUrl");
    return;
  }

  const url = _options.mode === "online" ? ONLINE_URL[_options.type] : _options.XYZUrl;

  return new TileLayer({
    layerName: _options.layerName,
    zIndex: _options.zIndex || 1,
    source: new XYZ({
      url,
      // TODO: 为了适应重庆自来水的需求，其它解决方式
      // 直接设置projection过后，在线地图不能获取
      ...(_options.mode === "offline" ? { projection: getProjectionByMapType("TDMap") } : {}),
    }),
  });
}
