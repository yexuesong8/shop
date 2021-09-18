import * as proj from "ol/proj";
import * as olExtent from 'ol/extent';
import projzh from "projzh";

const mc2gcj02mc = function(input, opt_output, opt_dimension) {
  var output = projzh.projection.sphericalMercator.inverse(input, opt_output, opt_dimension);
  output = projzh.datum.gcj02.fromWGS84(output, output, opt_dimension);
  return projzh.projection.sphericalMercator.forward(output, output, opt_dimension);
};

const gcj02mc2mc = function(input, opt_output, opt_dimension) {
  var output = projzh.projection.sphericalMercator.inverse(input, opt_output, opt_dimension);
  output = projzh.datum.gcj02.toWGS84(output, output, opt_dimension);
  return projzh.projection.sphericalMercator.forward(output, output, opt_dimension);
};

const gcj02mc2ll = function(input, opt_output, opt_dimension) {
  var output = projzh.projection.sphericalMercator.inverse(input, opt_output, opt_dimension);
  return projzh.datum.gcj02.toWGS84(output, output, opt_dimension);
};

const ll2gcj02mc = function(input, opt_output, opt_dimension) {
  var output = projzh.datum.gcj02.fromWGS84(input, opt_output, opt_dimension);
  return projzh.projection.sphericalMercator.forward(output, output, opt_dimension);
};

const gcj02mc = new proj.Projection({
  code: 'GCJ02MC',
  extent: olExtent.applyTransform([-180, -90, 180, 90], ll2gcj02mc),
  units: 'm',
});

proj.addProjection(gcj02mc);
proj.addCoordinateTransforms('EPSG:4326', gcj02mc, ll2gcj02mc, gcj02mc2ll);
proj.addCoordinateTransforms('EPSG:3857', gcj02mc, mc2gcj02mc, gcj02mc2mc);

export {
  proj,
  gcj02mc,
};
