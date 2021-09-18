<template>
  <div class="main-content-container full-fill">
    <geo-coordinate-selector />
    <div class="map-box">
      <div class="button-box">
        <el-button type="primary" @click="() => changeMap('TDMap')">天地图</el-button>
        <el-button type="primary" @click="() => changeMap('BDMap')">百度地图</el-button>
        <el-button type="primary" @click="() => changeMap('AMap')">高德地图</el-button>
        <!-- <el-button type="primary" @click="() => addMap('HeatMap')">热力图</el-button> -->
      </div>
      <div class="top-right-box">
        <div class="item" @click="() => startDraw('LineString')">绘制管线</div>
        <div class="item" @click="() => startDraw('Polygon')">绘制区域</div>
        <div class="item" @click="() => startMeasure('line')">测量距离</div>
        <div class="item" @click="() => startMeasure('polygon')">测量面积</div>
        <div class="item" @click="() => getDrawSource()">绘制数据</div>
      </div>
      <div class="right-button-box">
        <div class="location-icon" @click="resetLocation">
          <svg
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="5112"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="200"
            height="200"
            data-spm-anchor-id="0.0.0.i10.7e171c4enS9yHa"
          >
            <path
              d="M639.297829 382.7712c-17.2032-17.173943-37.829486-30.954057-60.328229-40.257829-22.498743-9.303771-46.811429-14.1312-71.153371-14.1312-24.341943 0-48.683886 4.827429-71.153371 14.1312-22.498743 9.303771-43.125029 23.054629-60.328229 40.257829-17.2032 17.173943-30.983314 37.800229-40.316343 60.240457-9.303771 22.469486-14.160457 46.752914-14.160457 71.0656 0 24.312686 4.827429 48.596114 14.160457 71.0656 9.303771 22.469486 23.083886 43.066514 40.316343 60.240457 17.2032 17.173943 37.829486 30.954057 60.328229 40.257829 22.469486 9.303771 46.811429 14.1312 71.153371 14.1312 24.341943 0 48.654629-4.827429 71.153371-14.1312 22.469486-9.303771 43.125029-23.054629 60.328229-40.257829 17.2032-17.173943 30.983314-37.770971 40.287086-60.240457 9.303771-22.440229 14.160457-46.752914 14.160457-71.0656 0-24.312686-4.856686-48.596114-14.160457-71.0656C670.3104 420.571429 656.530286 399.9744 639.297829 382.7712zM918.557257 467.529143c-16.647314-199.533714-162.962286-348.3648-362.788571-362.203429L555.768686 0l-85.4016 0 0 106.7008C276.128914 124.693943 122.090057 272.149943 105.442743 467.529143L0 467.529143l0 87.127771 105.442743 0c16.647314 195.3792 168.842971 343.2448 363.081143 362.642286L468.523886 1024l87.215543 0 0-105.325714c199.797029-13.867886 346.141257-164.512914 362.788571-364.046629L1024 554.627657 1024 467.529143 918.557257 467.529143zM512 847.082057c-184.5248 0-334.848-151.464229-334.848-334.379886 0-182.915657 151.698286-336.223086 334.848-336.223086 184.554057 0 334.848 153.307429 334.848 336.223086C846.848 695.588571 696.5248 847.082057 512 847.082057z"
              p-id="5113"
              data-spm-anchor-id="0.0.0.i9.7e171c4enS9yHa"
            />
          </svg>
        </div>
        <div id="scalebox" class="sacle-box">
          <div class="zoom_map zoom_in_map" type="in" @click="zoomIn">
            <span class="el-icon-plus" />
          </div>
          <div class="zoom_map zoom_out_map" type="out" @click="zoomOut">
            <span class="el-icon-minus" />
          </div>
        </div>
      </div>
      <div id="map">
        <div id="overlay-id">overlay</div>
      </div>
    </div>
  </div>
</template>

<script>
import Map from "@/components/Map/index.js";
import GeoCoordinateSelector from "@/components/GeoCoordinateSelector/item.vue";
import HeatMapData from "@/components/Map/heat-map-data-s";

export default {
  name: "MapDemo",
  components: {
    GeoCoordinateSelector,
  },
  data() {
    return {
      map: null,
      heatMap: HeatMapData,
    };
  },
  mounted() {
    const map = new Map({
      target: "map",
      center: [107.740910267146, 30.1835946292888],
    });

    const overlay = map.overlay.create({
      id: "overlayIdInMap", // 在地图中的overlay id
      element: document.querySelector("#overlay-id"), // 挂载元素
      position: [107.740910267146, 30.1835946292888], // 坐标
    });

    map.overlay.add(overlay);

    map.layer.createHeatMapLayer({
      data: this.heatMap,
    }).then(layer => {
      map.layer.add(layer);
    });

    map.EventBus.on("map.click", function({ event }) {
      console.log("this is on mouseup", event);
    });

    map.EventBus.on("feature.drawend", function({ wkt }) {
      console.log(wkt);
    });

    console.log(map);

    // const labelLayer = map.base.createLabelLayer();
    // map.layer.add(labelLayer);

    // const photographicLayer = map.base.createPhotographicLayer();
    // map.layer.add(photographicLayer);

    // map.addYXLayer();

    // map.addWMSLineLayer({
    //   url: "http://221.226.213.42:8595/geoserver/OpenGIS/wms",
    // });

    map.layer.add(map.layer.createWMSLineLayer({
      url: "http://221.226.213.42:8595/geoserver/OpenGIS/wms",
    }));

    this.map = map;

    // this.map.EventBus.on("feature.dragmove", function(events, x, y) {
    //   console.log("this is on dragmove", events, x, y);
    // });

    // this.map.EventBus.on("feature.mousedown", function(feature) {
    //   console.log("this is on mousedown", feature);
    // });

    // this.map.EventBus.on("feature.mouseup", function(feature) {
    //   console.log("this is on mouseup", feature);
    // });
  },

  methods: {
    zoomIn() {
      this.map.zoomIn();
    },
    zoomOut() {
      this.map.zoomOut();
    },
    resetLocation() {
      this.map.backToCenter();
    },
    startDraw(type) {
      this.map.draw.start({ type });
    },
    startMeasure(type) {
      this.$refs["map"].startMeasure(type);
    },
    getDrawSource() {
      console.log(this.map.draw.getWKTString());
    },
  },
};
</script>

<style lang="scss">
.map-box {
  position: relative;
  width: 100%;
  height: 100%;
  #map {
    width: 100%;
    height: 100%;
  }
  .button-box {
    top: 10px;
    left: 20px;
    position: absolute;
    z-index: 2;
  }
  .right-button-box {
    position: absolute;
    right: 10px;
    bottom: 10px;
    z-index: 1;
  }
  .scale-box {
    width: 29px;
    height: 73px;
    margin-top: 16px;
    padding: 0 2px;
  }
  .location-icon {
    position: relative;
    width: 32px;
    height: 32px;
    margin-bottom: 5px;
    background: #fff;
    text-align: center;
    cursor: pointer;
  }
  .location-icon svg {
    fill: #409eff;
    width: 20px;
    height: 20px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -10px 0 0 -10px;
  }
  #scalebox .zoom_map {
    width: 32px;
    height: 16px;
    margin: 0 auto;
    padding: 10px 0;
    cursor: pointer;
    text-align: center;
    background: #fff;
  }
  #scalebox .zoom_map.zoom_in_map {
    border-bottom: 1px #999 solid;
  }
  #scalebox .zoom_map span {
    display: inline-block;
    text-align: center;
  }
  .top-right-box {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 2;
    font-size: 12px;
    background: #fff;
  }
  .top-right-box .item {
    padding: 5px 5px;
    display: inline-block;
    border-right: 1px solid #dcdcdc;
    cursor: pointer;
  }
  .top-right-box .item:last-child {
    border-right: none;
  }
  #overlay-id {
    width: 50px;
    height: 50px;
    background: #000;
    color: red;
  }
}
</style>
