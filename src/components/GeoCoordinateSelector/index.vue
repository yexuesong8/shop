<template>
  <Dialog class="rb-geocoordinate-dialog" width="980px" :visible="visible" title="选择坐标" @cancel="handleCancel" @confirm="handleConfirm">
    <el-form label-width="auto">
      <el-row v-if="showSearch">
        <el-form-item label="地点搜索:">
          <el-autocomplete
            v-model="addressName"
            popper-class="rb-geocoordinate-auto-complete-popper"
            :fetch-suggestions="searchPosition"
            placeholder="请输入内容"
            clearable
            :trigger-on-focus="false"
            @select="handleSelect"
          >
            <i
              slot="suffix"
              class="el-icon-position el-input__icon"
            />
            <template slot-scope="{ item }">
              <div class="name">{{ item.name }}</div>
              <span class="addr">{{ item.address }}</span>
            </template>
          </el-autocomplete>
        </el-form-item>
      </el-row>
      <el-row :gutter="48">
        <el-col :span="12">
          <el-form-item label="经度:">
            <el-input v-if="isEdit" v-model="x" v-only-number @change="changeValue" />
            <el-input v-else :value="x" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="纬度:">
            <el-input v-if="isEdit" v-model="y" v-only-number @change="changeValue" />
            <el-input v-else :value="y" readonly />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div id="geocoordinate-map-container" />
    <div id="location-img" ref="locationImg" style="display: none">
      <img width="30" :src="getLocationImg()" alt>
    </div>
  </Dialog>
</template>

<script>
import { Dialog, baseRequest } from "@monkey.do/monkey";
import Map, { projzh } from "@/components/Map";
import { AMapWebServiceKey, TDMapWebServiceKey } from "@/config";
import LocationImg from "@assets/images/location.png";
// import { proj } from "@/components/Map/gcj02";

export default {
  name: "GeoCoordinateSelectorDialog",
  components: { Dialog },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    mapOptions: {
      type: Object,
    },
    showSearch: {
      type: Boolean,
      default: true,
    },
    showLabelLayer: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      map: null,
      x: null, // 经度
      y: null, // 纬度
      anchor: null,
      addressName: '',
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.createMap();
    });
  },
  methods: {
    getLocationImg() {
      return LocationImg;
    },
    handleConfirm() {
      if (this.x) {
        this.$emit("confirm", [this.x, this.y], this.addressName);
      } else {
        this.$emit("confirm", [], this.addressName);
      }
      this.handleCancel();
    },
    handleCancel() {
      this.addressName = '';
      this.x = null;
      this.y = null;
      this.map = null;

      this.$emit("update:visible", false);
      this.$emit("cancel");
    },
    searchPosition(data, callback) {
      const payload = {
        key: AMapWebServiceKey,
        keywords: data,
        types: '',
      };

      const instance = baseRequest({
        method: 'get',
      });

      instance({
        method: 'get',
        url: 'https://restapi.amap.com/v3/place/text?parameters',
        params: payload,
      }).then(res => {
        callback(res.data.pois || [{ name: '无相关位置信息', address: '' }]);
      });
    },
    changeValue() {
      this.x = Number(this.x).toFixed(6);
      this.y = Number(this.y).toFixed(6);
      this.createAnchor();
      this.setMapAddress();
      this.setCenter([this.x, this.y]);
    },
    createMap() {
      const self = this;
      this.map = new Map({
        target: "geocoordinate-map-container",
        baseMap: "TDMap",
        minZoom: 5,
        maxZoom: 18,
        zoom: 14,
        center: [106.54642571423338, 29.558798704614766],
        ...this.mapOptions,
      });

      this.map.EventBus.on("map.click", ({ event }) => {
        const { coordinate: [x, y] } = event;
        self.x = Number(x).toFixed(6);
        self.y = Number(y).toFixed(6);
        self.createAnchor();
        self.setMapAddress();
      });

      if (this.showLabelLayer) {
        const labelLayer = this.map.base.createLabelLayer();
        this.map.layer.add(labelLayer);
      }

      if (this.value && this.value[0] && this.value[1]) {
        this.x = this.value[0];
        this.y = this.value[1];
        this.createAnchor();
        this.setMapAddress();
        this.setCenter([this.x, this.y]);
      }
    },
    setCenter(position) {
      this.map.map.getView().setCenter(position);
    },
    createAnchor() {
      const img = this.$refs["locationImg"];
      img.style.display = "block";

      if (this.overlay) {
        this.map.overlay.remove(this.overlay);
      }

      const overlay = this.map.overlay.create({
        element: img,
        positioning: "center-center",
        position: [this.x, this.y],
      });

      this.map.overlay.add(overlay);
      this.overlay = overlay;
    },
    handleSelect(val) {
      if (val.address !== '') {
        this.addressName = `${val.name}(${val.address})`;

        let lonlat = [];
        lonlat = val.location.split(',');
        const X = Number(lonlat[0]);
        const Y = Number(lonlat[1]);
        const position = [X, Y];

        const newPosition = [];
        projzh.datum.gcj02.toWGS84(position, newPosition);

        this.x = X.toFixed(6);
        this.y = Y.toFixed(6);

        this.setCenter(newPosition);

        this.createAnchor();
      }
    },
    setMapAddress() {
      const payload = {
        postStr: "{ 'lon': " + this.x + ", 'lat': " + this.y + ", 'ver': 1 }",
        type: 'geocode',
        tk: TDMapWebServiceKey,
      };

      const instance = baseRequest({
        method: 'get',
      });

      instance({
        method: 'get',
        url: 'http://api.tianditu.gov.cn/geocoder',
        params: payload,
      }).then(res => {
        this.addressName = res.data.result.formatted_address;
      });
    },
  },
};
</script>

<style lang="scss">
#geocoordinate-map-container {
  width: 100%;
  height: 500px;
}
.rb-geocoordinate-dialog .el-autocomplete {
  position: relative;
  display: inline-block;
  width: 100%;
}
.rb-geocoordinate-auto-complete-popper .el-autocomplete-suggestion__list {
  li {
    line-height: 18px;
    padding: 8px;
    .name {
      text-overflow: ellipsis;
      overflow: hidden;
      margin-right: 10px;
    }
    .addr {
      font-size: 12px;
      color: #b4b4b4;
    }
    .highlighted .addr {
      color: #ddd;
    }
  }
}
</style>
