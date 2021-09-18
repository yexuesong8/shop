<template>
  <div class="rb-my-message">
    <span class="message-icon">
      <svg-icon icon-class="my-message" :class="{active: !!newMessage.length}" @click="handleMessageClick" />
    </span>
    <Dialog title="我的消息" :visible="visible" width="1200px" @cancel="handleCancel" @confirm="handleConfirm">
      <el-row class="mb20 clearfix">
        <el-col class="fl" :span="18">
          <el-date-picker v-model="date" start-placeholder="开始时间" end-placeholder="结束时间" type="daterange" @change="handleDateChange" />
        </el-col>
        <el-col class="fr" :span="6">
          <el-row class="fr" :gutter="8">
            <el-col :span="1.5">
              <el-button type="default" :disabled="!selectedRows.length" :loading="readLoading" @click="handleReadMessages">设为已读</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button type="default" :disabled="!selectedRows.length" :loading="deleteLoading" @click="handleBatchDelete">删除</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <Table ref="table" api="/api/v1/rabbit/system/message/find/page" :params="params" init-no-fetch>
        <template v-slot:default="slot">
          <el-table v-loading="slot.loading" :data="slot.list" row-key="id" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column label="时间" prop="sendTime">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.sendTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="标题" prop="title" width="180" show-overflow-tooltip />
            <el-table-column label="来源系统" prop="source" />
            <el-table-column label="发送人" prop="creatorName" width="120" show-overflow-tooltip />
            <el-table-column label="状态" width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.confirm === 1 ? "已读" : "未读" }}</span>
              </template>
            </el-table-column>
            <el-table-column label="内容" prop="content" width="220" show-overflow-tooltip />
            <template v-slot:empty>
              <no-data />
            </template>
          </el-table>
        </template>
      </Table>
    </Dialog>
  </div>
</template>

<script>
import { timeToUnix, dateToFinalTime, dateToZeroTime, NoData, websocket } from "@monkey.do/monkey";
import { batchDel, readMsg } from "@/api/data/message";
import Table from "@/components/Table";
import { mapGetters } from "vuex";

export default {
  name: "MyMessage",
  components: { Table, NoData },
  data() {
    return {
      visible: false,
      date: null,
      selectedRows: [],
      readLoading: false,
      tableLoading: false,
      deleteLoading: false,
      dateTime: {},
      newMessage: [],
      ws: null,
    };
  },
  computed: {
    ...mapGetters(["currentUserInfo"]),
    params() {
      return { receiverId: this.$store.getters.currentUserInfo.id, ...this.dateTime };
    },
  },
  watch: {
    currentUserInfo: { // 解决组件创建或者加载时 拿不到userInfo
      handler: function(value) {
        if (value.id) {
          this.createWebsocket(value.id);
        }
      },
      immediate: true,
      deep: true,
    },
  },
  beforeDestroy() {
    if (this.ws) {
      this.ws.destroy();
      this.ws = null;
    }
  },
  methods: {
    createWebsocket() {
      const wsUrl = this.$store.state.global.systemSetting.wsUrl;
      this.ws = websocket(wsUrl);
      const id = this.$store.getters.currentUserInfo.id;

      // 订阅消息通知
      this.ws.sendMessage({ c: "s", t: "rabbit.topic.message", l: id });

      // 监听新消息
      this.ws.onMessage((event) => {
        if (event["topic"] === "rabbit.topic.message") {
          this.newMessage.push(event["data"]);
        }
      });
    },

    handleConfirm() {
      this.handleCancel();
    },

    handleCancel() {
      this.visible = false;
      this.date = null;
    },

    handleMessageClick() {
      this.newMessage = [];
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["table"].refresh(1);
      });
    },

    handleDateChange(value) {
      if (value) {
        const beginTime = timeToUnix(dateToZeroTime(value[0]));
        const endTime = timeToUnix(dateToFinalTime(value[1]));
        this.dateTime = { beginTime, endTime };
      } else {
        this.dateTime = { beginTime: undefined, endTime: undefined };
      }
    },

    handleSelectionChange(selection) {
      this.selectedRows = selection;
    },

    handleReadMessages() {
      if (!this.selectedRows.length) return;
      const ids = this.selectedRows.map(item => item.id);
      this.readLoading = true;
      readMsg({ ids }).then(res => {
        this.readLoading = false;
        if (res.statusCode === 600) {
          this.$message.success("设置成功");
          this.$refs["table"].refresh();
        }
      });
    },

    handleBatchDelete() {
      if (!this.selectedRows.length) return;
      this.$doingConfirm({ title: "删除消息", message: "确定删除消息吗?" }).then(() => {
        const ids = this.selectedRows.map(item => item.id);
        this.deleteLoading = true;
        batchDel({ ids }).then(res => {
          this.deleteLoading = false;
          if (res.statusCode === 600) {
            this.$message.success("删除成功");
            this.$refs["table"].refresh(1);
          }
        });
      });
    },
  },
};
</script>

<style lang="scss">
.rb-my-message {
  .message-icon {
    position: relative;
    top: 1px;
    width: 13px;
    height: 13px;
    .svg-icon {
      width: 13px;
      height: 13px;
      cursor: pointer;
    }
    &.active {
      &:after {
        content: " ";
        position: absolute;
        top: 1px;
        right: -1px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #ff5454;
      }
    }
  }
}
</style>
