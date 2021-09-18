import OlMap from "ol/Map";
import View from "ol/View";
import { Modify, Snap } from "ol/interaction";
import Collection from 'ol/Collection';
import BaseMap, { createMapLayer } from "./base";
import { getProjectionByMapType, getFeatureByPixel } from "./utils/utils";
import { MapEvents, MapType, HighLightStyle } from "./config";
import Layer from "./layer";
import { defaults as defaultInteractions } from 'ol/interaction';
import { isArray } from "@monkey.do/monkey";
import projzh from "projzh";
import Drag from "./utils/drag";
import { EventBus } from "@/utils/event-bus";
import Overlay from "./overlay/index";
import Draw from "./draw";

let selectedFeature = null;
class Map {
  constructor(options) {
    this.options = options;
    this.map = null;
    this.baseMapLayer = null;
    this.zoomIndex = options.zoom;

    this.isModifying = false; // 是否处于编辑状态

    this.EventBus = new EventBus();

    this.base = new BaseMap({ type: options.baseMap || "TDMap" });
    this._initMap();

    this.layer = new Layer(this.map);
    this.overlay = new Overlay(this.map);
    this.draw = new Draw(this);
  }

  _initMap() {
    const { target, center, zoom = 15, baseMap = "TDMap" } = this.options;

    this.baseMapLayer = this.base.create({
      type: 1, // 电子地图
      mode: this.options.mode || "online",
      XYZUrl: this.options.XYZUrl,
    });

    const interactions = defaultInteractions({
      doubleClickZoom: false,
    });

    // TODO 移动鼠标 feature类型判断，热力图...
    const extendInteractions = this.options.drag ? [new Drag(this.EventBus)] : [];

    this.map = new OlMap({
      interactions: interactions.extend(extendInteractions),
      target: target,
      layers: [this.baseMapLayer],
      view: new View({
        center: center,
        projection: getProjectionByMapType(baseMap),
        zoom: zoom,
        multiWorld: false,
        maxZoom: this.options.maxZoom || 18,
        minZoom: this.options.minZoom || 5,
      }),
    });

    this._bindMapEvents();
  }

  _bindMapEvents() {
    MapEvents.forEach(mapEvent => {
      this.map.on(mapEvent, (...args) => {
        if (mapEvent === 'contextmenu') {
          document.oncontextmenu = function() {
            return false;
          };

          this.draw.end();

          this.endDraw();

          const features = getFeatureByPixel(...args, this.map);

          if (features) {
            if (!isArray(features)) {
              this._modify(null, [features]);
            } else {
              this._modify(null, features);
            }
          }
        }

        if (mapEvent === "pointermove") {
          this._onPointerMove(...args);
        }

        const event = args[0];

        this._bindSelfMapEvents(mapEvent, event);

        this.EventBus.emit(`map.${mapEvent}`, { event });
      });
    });
  }

  _bindSelfMapEvents(mapEvent, event) {
    if (mapEvent === 'moveend') {
      const zoomIndex = this.map.getView().getZoom();

      if (zoomIndex !== this.zoomIndex) {
        this.EventBus.emit("map.zoom", { event, zIndex: zoomIndex });
      }

      if (zoomIndex < this.zoomIndex) {
        this.EventBus.emit("map.zoomout", { event, zIndex: zoomIndex });
      }

      if (zoomIndex > this.zoomIndex) {
        this.EventBus.emit("map.zoomin", { event, zIndex: zoomIndex });
      }

      this.zoomIndex = zoomIndex;
    }
  }

  changeBaseMap(mapType) {
    if (!MapType[mapType]) {
      console.error("没有对应的底图");
      return;
    }
    const baseMapLayer = createMapLayer(mapType);
    this.layer.remove(this.baseMapLayer);
    this.baseMapLayer = baseMapLayer;
    this.layer.add(this.baseMapLayer);
  }

  addTDMapDXLayer() {
    const TDMapDXLayer = createMapLayer("TDMap", {
      type: 3,
      layerName: "TD-DX",
    });
    this.layer.add(TDMapDXLayer);
    return TDMapDXLayer;
  }

  /**
   * @param {Source} source 需要要修改的source
   * @param {Feature} [features] 需要修改的features
   */
  _modify(source, features) {
    console.log("modify feature", features);

    const collectionFeatures = new Collection(features);

    if (source) {
      this.olModify = new Modify({ source: source });
      this.olSnap = new Snap({ source: source });

      this.map.addInteraction(this.olModify);
      this.map.addInteraction(this.olSnap);

      this.isModifying = true;
      return;
    }

    if (features) {
      this.olModify = new Modify({ features: collectionFeatures });
      this.olSnap = new Snap({ features: collectionFeatures });

      this.map.addInteraction(this.olModify);
      this.map.addInteraction(this.olSnap);

      this.isModifying = true;
    }
  }

  _onPointerMove(event) {
    if (this.isModifying) return;
    if (this.draw.isDrawing) return;

    const map = event.map;

    if (selectedFeature !== null) {
      selectedFeature.setStyle();
      selectedFeature = null;
    }

    // const pixel = map.map.getEventPixel(event.originalEvent);
    map.forEachFeatureAtPixel(
      event.pixel,
      function(feature) {
        selectedFeature = feature;
        feature.setStyle(HighLightStyle);
        return true;
      },
    );

    map.getTargetElement().style.cursor = selectedFeature ? 'pointer' : '';
  }

  endDraw() {
    if (this.olModify) {
      console.log(this.olModify);
      this.map.removeInteraction(this.olModify);
      this.olModify = null;
    }
    if (this.olSnap) this.map.removeInteraction(this.olSnap);
    this.isModifying = false;
  }

  zoom(zoomIndex) {
    this.map.getView().setZoom(zoomIndex);
    this.zoomIndex = zoomIndex;
  }

  zoomIn() {
    this.map.getView().setZoom(parseInt(this.zoomIndex + 1));
  }

  zoomOut() {
    this.map.getView().setZoom(parseInt(this.zoomIndex - 1));
  }

  backToCenter() {
    if (this.options.center && this.options.center.length) this.map.getView().setCenter(this.options.center);
  }
}

export default Map;

export {
  projzh,
};
