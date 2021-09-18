<template>
  <!-- 数据管理-字段管理 容器 -->
  <div class="main-content-container">
    <list-container ref="listContainer" api="/api/v1/rabbit/system/message/find/page" :form-props="{ 'label-width': 'auto' }">
      <template v-slot:form="slot">
        <FilterSearch>
          <template v-slot:search>
            <el-row class="mt10">
              <el-col :span="6">
                <el-form-item label="标题:" prop="title">
                  <el-input v-model="slot.form.title" placeholder="请输入标题" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="内容:" class="ml10" prop="content">
                  <el-input v-model="slot.form.content" placeholder="请输入内容" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="适用范围:" class="ml10" prop="appId">
                  <dictionary-selector v-model="slot.form.appId" code="general_app" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="ml10">
                  <el-button type="primary" :loading="slot.loading" @click="slot.search">搜索</el-button>
                  <el-button @click="slot.reset">重置</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
          <template v-slot:actions>
            <el-button type="primary" @click="handleAdd">新增</el-button>
          </template>
        </FilterSearch>
      </template>
      <template v-slot:table="table">
        <el-table v-fixedTable class="mt10" :data="table.list">
          <el-table-column prop="title" label="标题" :show-overflow-tooltip="true" min-width="160" />
          <el-table-column prop="content" label="内容" :show-overflow-tooltip="true" min-width="160" />
          <el-table-column prop="send" label="是否已发送" show-overflow-tooltip min-width="80">
            <template slot-scope="scope">
              <span>{{ scope.row.send === 1 ? "是" : "否" }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="sendTime" label="发送时间" :show-overflow-tooltip="true" min-width="160">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.sendTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="confirm" label="是否已确认" show-overflow-tooltip min-width="80">
            <template slot-scope="scope">
              <span>{{ scope.row.confirm === 1 ? "是" : "否" }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="confirmTime" label="确认时间" :show-overflow-tooltip="true" min-width="160">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.confirmTime) }}</span>
            </template>
          </el-table-column>
          <ApplicationColumn width="120" show-overflow-tooltip />
          <el-table-column label="创建时间" prop="createTime" width="150">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </list-container>
    <Detail :visible="visible" :title="title" @close="handleCancel" @refresh="handleRefresh" />
  </div>
</template>

<script>
import Detail from "./detail";

export default {
  name: "Message",
  components: {
    Detail,
  },
  data() {
    return {
      title: "",
      total: 0,
      visible: false,
    };
  },
  methods: {
    // 刷新
    refresh() {
      this.$refs.listContainer.refresh(1);
    },
    handleRefresh() {
      this.refresh();
    },
    // 新增
    handleAdd() {
      this.visible = true;
      this.title = "新增消息";
    },
    // 关闭
    handleCancel() {
      this.visible = false;
    },
  },
};
</script>
