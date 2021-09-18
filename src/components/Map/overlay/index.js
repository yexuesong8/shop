import {
  createOverlay,
  addOverlay,
  clearOverlay,
  removeOverlay,
} from "./helper";
import { isArray } from "@monkey.do/monkey";

export default class Overlay {
  constructor(map) {
    this.map = map;
  }

  create(options) {
    return createOverlay(options);
  }

  add(overlay) {
    addOverlay(overlay, this.map);
  }

  remove(overlay) {
    if (isArray(overlay)) {
      overlay.forEach(lay => {
        removeOverlay(lay, this.map);
      });
    } else {
      removeOverlay(overlay, this.map);
    }
  }

  clear() {
    clearOverlay(this.map);
  }
}

