import VectorSource from 'ol/source/Vector';
import Feature from "ol/Feature.js";
import Point from "ol/geom/Point.js";
import { Heatmap as HeatMapLayer } from 'ol/layer';
import request from "@/utils/request";

export async function createHeatMapLayer(
  {
    url,
    params,
    dataFormatter = data => data,
    data,
    layerOption = { blur: 15, radius: 15 },
  }
) {
  let heatMapData = dataFormatter(data || []);

  if (url) {
    await request({ url: url, data: params || {}}).then(res => {
      if (res.statusCode === 600) {
        heatMapData = dataFormatter(res.data);
      }
    });
  }

  const source = new VectorSource(); // 新生成图层源,用于存放热力图图层
  heatMapData.forEach((item) => { // 遍历热力图数据,生成热力图feature
    const feature = new Feature({
      geometry: new Point([Number(item.lon), Number(item.lat)]),
      weight: item.weight,
    });
    source.addFeature(feature);
  });

  const heatMapLayer = new HeatMapLayer({
    source: source,
    weight: function(feature) {
      // 2012_Earthquakes_Mag5.kml stores the magnitude of each earthquake in a
      // standards-violating <magnitude> tag in each Placemark.  We extract it from
      // the Placemark's name instead.
      // var name = feature.get('name');
      // var magnitude = parseFloat(name.substr(2));
      // return magnitude - 5;
      const weight = feature.get("weight"); // 获取feature的weight参数值,此处weight不可变更为其他参数,否则失效(暂时不明原因);
      return weight / 1;
    },
    zIndex: 10,
    ...layerOption,
  });

  return heatMapLayer;
}
