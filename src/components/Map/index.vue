<script>
import Map from "ol/Map";
import View from "ol/View";
import XYZ from "ol/source/XYZ";
import TileGrid from "ol/tilegrid/TileGrid";
import * as proj from "ol/proj";
import projzh from "projzh";
import { Draw, Modify, Snap } from "ol/interaction";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
// import createHeatMapLayer from "./HeatMap";
// import { fromLonLat } from "ol/proj.js";
import startMeasure from "./measure";
import { createMapLayer } from "./base-map/index.js";
import { createWMSLineLayer, createWMSPointLayer } from "./layer/wms";
import { MapEvents } from "./config";
import { createOverlay, addOverlay, addOverlays, removeOverlay, removeOverlays } from "./overlay";

export default {
  name: "App",
  props: {
    ele: {
      type: String,
      default: "map",
    },
    baseMap: {
      type: String,
      default: "TDMap",
    },
    heatMap: {
      type: Object,
      default: () => ({
        data: [],
        blur: 15,
        radius: 15,
      }),
    },
  },
  data() {
    return {
      baseMapLayer: null,
      defaultCenter: [119.0513139, 31.6817343],
      draw: null,
      snap: null,
      modify: null,
      drawLayer: {
        layer: null,
        featrues: [],
      },
      pipelineLayer: null,
      pipeline: {
        layer: null,
      },
    };
  },
  mounted() {
    const baseMapLayer = createMapLayer(this.baseMap);
    const WMSLineLayer = createWMSLineLayer();
    const WMSPointLayer = createWMSPointLayer();

    this.baseMapLayer = baseMapLayer;

    const map = new Map({
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

    this.map = map;

    this.bindMapEvents(map);

    this.$emit("ready", map);

    this.stopDocumentContextmenu();
  },

  methods: {
    getMap() {
      return this.map;
    },

    bindMapEvents(map) {
      MapEvents.forEach(mapEvent => {
        map.on(mapEvent, (...args) => {
          if (mapEvent === 'contextmenu') {
            this.mapOnContextmenu();
          }
          this.$emit(mapEvent, ...args);
        });
      });
    },

    mapOnContextmenu() {
      this.endDraw();
    },

    stopDocumentContextmenu() {
      document.oncontextmenu = function() {
        return false;
      };
    },

    getProjection(mapType) {
      switch (mapType) {
        case "TDMap":
          return "EPSG:4326";
        case "AMap":
          return "EPSG:4326";
        case "BDMap":
          return "EPSG:3857";
        default:
          return "EPSG:4326";
      }
    },

    getCoord(coord) {
      return this.mapType === "BDMap"
        ? proj.transform(coord, "EPSG:4326", "baidu")
        : coord;
    },

    changeMap(mapType) {
      this.map.removeLayer(this.baseMapLayer);
      this.baseMapLayer = null;
      const baseMapLayer = this.createMapLayer(mapType);
      this.baseMapLayer = baseMapLayer;
      this.map.addLayer(baseMapLayer);
      this.baseMapLayer.setZIndex(0);
    },

    createMapLayer(mapType) {
      return createMapLayer(mapType);
    },

    // BDMap(options = { layerName: "BDMap", url: "" }) {
    BDMap() {
      // https://github.com/openlayers/openlayers/issues/3522
      this.map.getView().setConstrainResolution(true);

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

      var xyzTileUrlFunction = baiduSource.getTileUrlFunction();
      var tmsTileUrlFunction = function([z, x, y]) {
        return xyzTileUrlFunction([z, x, -y - 1]);
      };
      baiduSource.setTileUrlFunction(tmsTileUrlFunction);

      return new TileLayer({
        source: baiduSource,
      });
    },

    // GISLineLayer() {
    //   return new TileLayer({
    //     source: new TileWMS({
    //       url: "http://221.226.213.42:8595/geoserver/OpenGIS/wms",
    //       crossOrigin: "anonymous",
    //       tileLoadFunction: getWMSSourceBySecurity,
    //       params: {
    //         FORMAT: "image/png",
    //         VERSION: "1.1.1",
    //         LAYERS: "OpenGIS:GisLine",
    //         tiled: true,
    //         exceptions: "application/vnd.ogc.se_inimage",
    //       },
    //     }),
    //     zIndex: 1,
    //   });
    // },
    // WMSPointLayer() {
    //   return new TileLayer({
    //     source: new TileWMS({
    //       url: "http://221.226.213.42:8595/geoserver/OpenGIS/wms",
    //       crossOrigin: "anonymous",
    //       tileLoadFunction: getWMSSourceBySecurity,
    //       params: {
    //         FORMAT: "image/png",
    //         VERSION: "1.1.1",
    //         LAYERS: "OpenGIS:GisPoint",
    //         tiled: true,
    //         exceptions: "application/vnd.ogc.se_inimage",
    //       },
    //     }),
    //     zIndex: 2,
    //   });
    // },

    // addHeaTMap() {
    //   if (this.heatMap.data) {
    //     const heatMapLayer = createHeatMapLayer(this.heatMap);
    //     this.map.addLayer(heatMapLayer);
    //   }
    // },

    startDraw(type) {
      let layer = this.pipeline.layer;

      const source = layer ? layer.getSource() : new VectorSource();

      console.log("source", source);
      console.log("features", source.getFeatures());
      const features = source.getFeatures();
      features.forEach(feature => {
        console.log(feature);
        console.log(feature.getGeometry());
      });

      if (!layer) {
        layer = new VectorLayer({
          source: source,
          style: new Style({
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
          }),
        });
        this.map.addLayer(layer);
        layer.setZIndex(1);
        this.pipeline.layer = layer;
      }

      this.modify = new Modify({ source: source });
      this.draw = new Draw({
        source: source,
        type: type,
      });
      this.snap = new Snap({ source: source });

      this.map.addInteraction(this.draw);
      this.map.addInteraction(this.snap);
      this.map.addInteraction(this.modify);
    },

    endDraw() {
      if (this.draw) this.map.removeInteraction(this.draw);
      if (this.modify) this.map.removeInteraction(this.modify);
      if (this.snap) this.map.removeInteraction(this.snap);
    },

    zoomIn() {
      const view = this.map.getView();
      const curZoom = view.getZoom();
      view.animate({ zoom: curZoom + 1 });
    },
    zoomOut() {
      const view = this.map.getView();
      const curZoom = view.getZoom();
      view.animate({ zoom: curZoom - 1 });
    },
    resetLocation() {
      const view = this.map.getView();
      console.log(this.getCoord(this.defaultCenter));
      view.animate({ center: this.getCoord(this.defaultCenter) });
    },
    startMeasure(type = "line") {
      startMeasure(type, this.map);
    },

    createOverlay(options) {
      return createOverlay(options);
    },

    addOverlay(overlay) {
      addOverlay(overlay, this.map);
    },

    removeOverlay(overlay) {
      removeOverlay(overlay, this.map);
    },

    addOverlays(overlays) {
      addOverlays(overlays, this.map);
    },

    removeOverlays(overlays) {
      removeOverlays(overlays, this.map);
    },

  },
};
</script>
