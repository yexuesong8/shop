export function getProjectionByMapType(mapType) {
  switch (mapType) {
    case "TDMap":
      return "EPSG:4326";
    case "AMap":
      return "EPSG:4326";
    case "BDMap":
      return "EPSG:4326";
    default:
      return "EPSG:4326";
  }
}

export function getFeatureByPixel(evt, map) {
  return map.forEachFeatureAtPixel(evt.pixel, function(feature) {
    return feature;
  });
}
