
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Draw as OlDraw } from "ol/interaction";
import { WKT } from "ol/format";
import { DrawStyle } from "../config";

export default class Draw {
  constructor(map) {
    this.isDrawing = true;
    this.draw = null;
    this.layer = null;
    this.map = map;
  }

  /**
   * @param {object} options 绘制参数 https://openlayers.org/en/latest/apidoc/module-ol_interaction_Draw-Draw.html
   * @param {object} [layer] 绘制元素的图层
   */
  start({ type: drawType }, layer) {
    this.isDrawing = true;

    let drawLayer = layer || this.layer;

    if (!drawLayer) {
      drawLayer = drawLayer = new VectorLayer({
        style: DrawStyle,
      });

      this.layer = drawLayer;
      this.layer.setZIndex(1);
      this.map.layer.add(drawLayer);
    }

    const source = drawLayer.getSource() || new VectorSource();
    drawLayer.setSource(source);

    this.draw = new OlDraw({
      source: source,
      type: drawType,
    });

    this.draw.on("drawend", (event) => {
      const wktString = new WKT().writeFeature(event.feature);
      this.map.EventBus.emit("feature.drawend", { event, feature: event.feature, wkt: wktString });

      this.end();
    });

    this.map.map.addInteraction(this.draw);
  }

  end() {
    if (this.draw) this.map.map.removeInteraction(this.draw);
    this.isDrawing = false;
  }

  getLayer() {
    return this.layer;
  }

  getWKTString() {
    const source = this.layer.getSource();
    const features = source.getFeatures() || [];

    return features.map(feature => {
      const wktString = new WKT().writeFeature(feature);
      return {
        feature,
        wkt: wktString,
      };
    });
  }
}
