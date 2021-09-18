<template>
  <div class="app-container rb-user-center">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div class="text-center">
              <userAvatar :user="user" @uploadSuccess="handleUploadSuccess" />
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <svg-icon icon-class="user" />姓名
                <div class="fr">{{ currentUserInfo.name }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="phone" />手机号码
                <div class="fr">{{ currentUserInfo.phone }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="email" />用户邮箱
                <div class="fr">{{ currentUserInfo.email }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="tree" />所属部门
                <div class="fr">{{ currentUserInfo.deptName }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="date" />创建日期
                <div class="fr">
                  {{ parseTime(currentUserInfo.createTime) }}
                </div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>基本资料</span>
          </div>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="userinfo">
              <userInfo :user="currentUserInfo" />
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="resetPwd">
              <resetPwd :user="currentUserInfo" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import userAvatar from "./userAvatar";
import userInfo from "./userInfo";
import resetPwd from "./resetPwd";
import { mapGetters } from "vuex";

export default {
  name: "Profile",
  components: { userAvatar, userInfo, resetPwd },
  data() {
    return {
      user: {},
      roleGroup: {},
      postGroup: {},
      activeTab: "userinfo",
    };
  },
  computed: {
    ...mapGetters(["currentUserInfo"]),
  },
  methods: {
    handleUploadSuccess(data) {
      this.$store.dispatch("UserBaseUpdate", data).then((res) => {
        if (res.statusCode === 600) this.$store.dispatch("GetInfo");
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.rb-user-center {
  .list-group {
    padding-left: 0;
    list-style: none;
  }
  .list-group-item {
    border-bottom: 1px solid #e7eaec;
    border-top: 1px solid #e7eaec;
    margin-bottom: -1px;
    padding: 11px 0;
    font-size: 13px;
    .svg-icon {
      position: relative;
      top: 2px;
      margin-right: 3px;
    }
  }
}
</style>
