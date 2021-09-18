<template>
  <div class="new-uri">
    <el-row>
      <el-col :span="24" class="line">
        <!-- <div>接口</div> -->
        <div class="segmentation" />
      </el-col>
    </el-row>
    <el-table :data="uris">
      <el-table-column label="名称" prop="name" min-width="60px">
        <template slot-scope="scope">
          <el-form v-if="scope.row.edit" :ref="'collectionMoney'+scope.$index" :model="submitUri[scope.$index]" :rules="rules">
            <el-form-item prop="money" style="margin-bottom: 0;">
              <el-input v-model="(submitUri[scope.$index] || {}).name" placeholder="请输入" />
            </el-form-item>
          </el-form>
          <span v-else>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="路径" prop="path" min-width="120px">
        <template slot-scope="scope">
          <el-form v-if="scope.row.edit" :ref="'collectionMoney'+scope.$index" :model="submitUri[scope.$index]" :rules="rules">
            <el-form-item prop="money" style="margin-bottom: 0;">
              <el-input v-model="(submitUri[scope.$index] || {}).path" placeholder="请输入" />
            </el-form-item>
          </el-form>
          <span v-else>{{ scope.row.path }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130px">
        <template slot-scope="scope">
          <el-button v-if="scope.row.cancel" type="text" @click="handleSaveUri(scope)">保存</el-button>
          <el-button v-if="scope.row.cancel" type="text" @click="handleCancelUri(scope)">取消</el-button>
          <el-button v-if="!scope.row.cancel" type="text" @click="handleEditUri(scope)">编辑</el-button>
          <el-popconfirm
            v-if="!scope.row.handle || scope.row.add"
            style="margin-left: 10px;"
            icon="el-icon-info"
            title="是否要删除此行？"
            @confirm="handleDeleteButton(scope)"
          >
            <el-button slot="reference" type="text">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div class="add">
      <el-button icon="el-icon-plus" class="btn" @click="handleNewUri">新增接口</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Uri",

  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      uris: [],
      submitUri: {},
      origin: {},
    };
  },

  watch: {
    data: function(value) {
      this.uris = value || [];
      value.forEach((item, index) => {
        this.submitUri[index] = item;
        this.origin = { ...this.origin, [index]: { ...item }};
      });
    },
  },

  methods: {
    // 新增
    handleNewUri() {
      const obj = { name: undefined, path: undefined, edit: true };
      this.submitUri[this.uris.length] = obj;
      this.uris.push(obj);
    },

    // 修改
    handleEditUri(uri) {
      this.uris.splice(uri.$index, 1, { ...this.submitUri[uri.$index], edit: true, cancel: true });
    },

    handleCancelUri(uri) {
      this.uris.splice(uri.$index, 1, { ...this.origin[uri.$index], edit: undefined, cancel: undefined });
    },

    handleSaveUri(uri) {
      this.uris.splice(uri.$index, 1, { ...this.submitUri[uri.$index], edit: undefined, cancel: undefined });
    },

    // 删除
    handleDeleteButton(uri) {
      this.uris.splice(uri.$index, 1);
      // 删除对应数据
      Reflect.deleteProperty(this.uris, uri.$index);
    },

    gerSubmitUri() {
      return this.submitUri || {};
    },
  },
};
</script>
