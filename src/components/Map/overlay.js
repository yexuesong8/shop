import Overlay from 'ol/Overlay';

export function createOverlay(options) {
  return new Overlay(options);
}

export function addOverlay(overlay, map) {
  map.addOverlay(overlay);
}

export function addOverlays(overlays, map) {
  overlays.forEach(overlay => {
    map.addOverlay(overlay);
  });
}

export function removeOverlay(overlay, map) {
  map.removeOverlay(overlay);
}

export function removeOverlays(overlays, map) {
  overlays.forEach(overlay => {
    removeOverlay(overlay, map);
  });
}

export function clearOverlay(map) {
  const overlays = map.getOverlays();
  removeOverlays(overlays, map);
}
