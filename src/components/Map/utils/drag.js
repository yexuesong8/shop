
import { Pointer as PointerInteraction } from 'ol/interaction';

var Drag = (function(PointerInteraction) {
  function Drag(EventBus) {
    PointerInteraction.call(this, {
      handleDownEvent: function(evt) {
        var map = evt.map;

        var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
          return feature;
        });

        if (feature) {
          this.coordinate_ = evt.coordinate;
          this.feature_ = feature;

          EventBus.emit("feature.mousedown", {
            target: feature,
            event: evt,
          });
        }

        return !!feature;
      },
      handleDragEvent: function(evt) {
        var deltaX = evt.coordinate[0] - this.coordinate_[0];
        var deltaY = evt.coordinate[1] - this.coordinate_[1];

        var geometry = this.feature_.getGeometry();
        geometry.translate(deltaX, deltaY);

        this.coordinate_[0] = evt.coordinate[0];
        this.coordinate_[1] = evt.coordinate[1];

        EventBus.emit("feature.dragmove", {
          evt,
          x: deltaX,
          y: deltaY,
        });
      },
      handleMoveEvent: function(evt) {
        if (this.cursor_) {
          var map = evt.map;
          var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
            return feature;
          });
          var element = evt.map.getTargetElement();
          if (feature) {
            if (element.style.cursor !== this.cursor_) {
              this.previousCursor_ = element.style.cursor;
              element.style.cursor = this.cursor_;
            }
          } else if (this.previousCursor_ !== undefined) {
            element.style.cursor = this.previousCursor_;
            this.previousCursor_ = undefined;
          }
        }
      },
      handleUpEvent: function() {
        EventBus.emit("feature.mouseup", {
          feature: this.feature_,
        });
        this.coordinate_ = null;
        this.feature_ = null;
        return false;
      },
    });

    /**
     * @type {import("../src/ol/coordinate.js").Coordinate}
     * @private
     */
    this.coordinate_ = null;

    /**
     * @type {string|undefined}
     * @private
     */
    this.cursor_ = 'pointer';

    /**
     * @type {Feature}
     * @private
     */
    this.feature_ = null;

    /**
     * @type {string|undefined}
     * @private
     */
    this.previousCursor_ = undefined;
  }

  // eslint-disable-next-line no-proto
  if (PointerInteraction) Drag.__proto__ = PointerInteraction;
  Drag.prototype = Object.create(PointerInteraction && PointerInteraction.prototype);
  Drag.prototype.constructor = Drag;

  return Drag;
}(PointerInteraction));

export default Drag;
