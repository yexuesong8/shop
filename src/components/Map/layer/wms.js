import { Tile as TileLayer } from "ol/layer";
import TileWMS from "ol/source/TileWMS";
import { Base64 } from "js-base64";

const SNTGIS = {};
SNTGIS.userName = "admin";
SNTGIS.passWord = "Sntsoft123";

// 加密账号和密码
function authenticateUser(user, password) {
  var token = user + ":" + password;
  var hash = "Basic " + Base64.encode(token);
  return hash;
}

function getWMSSourceBySecurity(tile, src) {
  const client = new XMLHttpRequest();
  client.open("GET", src);
  client.responseType = "arraybuffer";
  client.setRequestHeader(
    "Authorization",
    authenticateUser(SNTGIS.userName, SNTGIS.passWord)
  );
  client.onload = function() {
    var arrayBufferView = new Uint8Array(this.response);
    var blob = new Blob([arrayBufferView], { type: "image/png" });
    var urlCreator = window.URL || window.webkitURL;
    var imageUrl = urlCreator.createObjectURL(blob);
    tile.getImage().src = imageUrl;
  };
  client.send();
}

export function createWMSLayer() {
  return new TileLayer({
    source: new TileWMS({
      url: "http://221.226.213.42:8595/geoserver/OpenGIS/wms",
      crossOrigin: "anonymous",
      tileLoadFunction: getWMSSourceBySecurity,
      params: {
        FORMAT: "image/png",
        VERSION: "1.1.1",
        LAYERS: "OpenGIS:GisPoint",
        tiled: true,
        exceptions: "application/vnd.ogc.se_inimage",
      },
    }),
    zIndex: 2,
  });
}

export function createWMSLineLayer(options) {
  return new TileLayer({
    source: new TileWMS({
      // url: options.url, "http://221.226.213.42:8595/geoserver/OpenGIS/wms",
      url: options.url,
      crossOrigin: "anonymous",
      tileLoadFunction: getWMSSourceBySecurity,
      params: {
        FORMAT: "image/png",
        VERSION: "1.1.1",
        LAYERS: "OpenGIS:GisLine",
        tiled: true,
        exceptions: "application/vnd.ogc.se_inimage",
      },
    }),
    zIndex: 1,
  });
}

export function createWMSPointLayer(options) {
  return new TileLayer({
    source: new TileWMS({
      // url: "http://221.226.213.42:8595/geoserver/OpenGIS/wms",
      url: options.url,
      crossOrigin: "anonymous",
      tileLoadFunction: getWMSSourceBySecurity,
      params: {
        FORMAT: "image/png",
        VERSION: "1.1.1",
        LAYERS: "OpenGIS:GisPoint",
        tiled: true,
        exceptions: "application/vnd.ogc.se_inimage",
      },
    }),
    zIndex: 2,
  });
}
