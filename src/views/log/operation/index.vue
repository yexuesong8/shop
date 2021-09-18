<template>
  <div class="main-content-container">
    <list-container
      ref="ListContainer"
      api="/api/v1/rabbit/system/operation/find/page"
      :form-props="{ 'label-width': 'auto' }"
    >
      <template v-slot:form="slot">
        <FilterSearch class="mb10">
          <template v-slot:search>
            <el-row :gutter="64" class="mt10">
              <el-col :span="16">
                <div class="flex-between">
                  <el-form-item label="操作人员姓名:">
                    <el-input v-model="slot.form.memberName" v-enter-search="slot.search" clearable />
                  </el-form-item>
                  <el-form-item label="操作模块:">
                    <el-input v-model="slot.form.action" v-enter-search="slot.search" clearable />
                  </el-form-item>
                  <el-form-item label="模块方法:">
                    <el-input v-model="slot.form.operation" v-enter-search="slot.search" clearable />
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="16">
                <div class="flex-between">
                  <el-form-item label="请求参数:">
                    <el-input v-model="slot.form.parame" v-enter-search="slot.search" clearable />
                  </el-form-item>
                  <el-form-item label="返回值:" clearable>
                    <el-input v-model="slot.form.result" v-enter-search="slot.search" clearable />
                  </el-form-item>
                  <el-form-item label="接口地址:">
                    <el-input v-model="slot.form.path" v-enter-search="slot.search" clearable />
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="fr">
                  <el-form-item>
                    <el-button
                      type="primary"
                      :loading="slot.loading"
                      @click="slot.search()"
                    >查询</el-button>
                    <el-button @click="slot.reset()">重置</el-button>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
          </template>
          <template v-slot:actions>
            <el-button
              class="el-icon-refresh"
              :loading="slot.loading"
              @click="slot.refresh()"
            />
          </template>
        </FilterSearch>
      </template>
      <template v-slot:table="slot">
        <el-table v-fixedTable v-loading="slot.loading" :data="slot.list">
          <el-table-column
            prop="memberName"
            label="操作人员姓名"
            width="120px"
            show-overflow-tooltip
          />
          <el-table-column
            prop="action"
            label="操作模块"
            width="120px"
            show-overflow-tooltip
          />
          <el-table-column
            prop="operation"
            label="操作方法"
            width="120px"
            show-overflow-tooltip
          />
          <el-table-column
            prop="parame"
            label="请求参数"
            width="200px"
            show-overflow-tooltip
          />
          <el-table-column
            prop="result"
            label="返回值"
            min-width="200px"
            show-overflow-tooltip
          />
          <el-table-column
            prop="path"
            label="接口地址"
            min-width="200px"
            show-overflow-tooltip
          />
          <el-table-column label="创建时间" width="150px">
            <template v-slot:default="slot">{{
              parseTime(slot.row.createTime)
            }}</template>
          </el-table-column>
          <template v-slot:empty>
            <no-data />
          </template>
        </el-table>
      </template>
    </list-container>
  </div>
</template>

<script>

export default {
  name: "OperationLog",
};
</script>
