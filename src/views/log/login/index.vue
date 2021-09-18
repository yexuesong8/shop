<template>
  <div class="main-content-container">
    <list-container
      ref="ListContainer"
      api="/api/v1/rabbit/system/login/log/find/page"
      :form-props="{ 'label-width': 'auto' }"
    >
      <template v-slot:form="slot">
        <FilterSearch class="mb10">
          <template v-slot:search>
            <el-row class="mt10">
              <el-row :gutter="64">
                <el-col :span="8">
                  <el-form-item label="成员名称:" prop="memberName">
                    <el-input v-model="slot.form.memberName" v-enter-search="slot.search" placeholder="请输入成员名称" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="登录状态:" prop="status">
                    <dictionary-selector code="login_status" :value.sync="slot.form.status" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="登录类型:" prop="loginType">
                    <dictionary-selector v-model="slot.form.loginType" code="login_type" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="日期：" prop="createTime">
                    <DateTimePicker v-model="slot.form" type="daterange" :property="{beginTime: 'beginTime',endTime: 'endTime'}" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item>
                    <el-button type="primary" :loading="slot.loading" @click="slot.search()">搜索</el-button>
                    <el-button @click="slot.reset()">重置</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
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
        <el-table v-loading="slot.loading" :data="slot.list" border>
          <el-table-column
            prop="memberName"
            label="登录人"
            width="150"
          />
          <el-table-column label="登录状态">
            <template v-slot:default="slot">
              {{ dictFormatter("login_status", slot.row.status) }}
            </template>
          </el-table-column>
          <el-table-column label="登录类型">
            <template v-slot:default="slot">
              {{ dictFormatter("login_type", slot.row.loginType) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="cause"
            label="失败原因"
            width="200"
            show-overflow-tooltip
          />
          <el-table-column prop="ip" label="ip" width="200" />
          <el-table-column
            prop="browser"
            label="浏览器"
            width="width"
          />
          <el-table-column
            prop="operateSystem"
            label="操作系统"
            width="width"
          />
          <el-table-column prop="createTime" label="登录时间" width="150">
            <template v-slot:default="slot">
              {{ slot.row.createTime | formatTime }}
            </template>
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
import {
  FilterSearch,
  parseTime,
  NoData,
  DateTimePicker,
} from "@monkey.do/monkey";

export default {
  name: "LoginLog",
  components: {
    FilterSearch,
    NoData,
    DateTimePicker,
  },
  filters: {
    formatTime: val => parseTime(val),
  },
  data() {
    return {
    };
  },
  methods: {
    search() {},
  },
};
</script>
