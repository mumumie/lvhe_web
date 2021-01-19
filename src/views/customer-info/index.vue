<template>
  <div class="content-box">
    <el-card class="box-card">
      <div slot="header" class="card-header">
        <span>{{ userInfo.nickname }}</span>
      </div>
      <div class="card-content">
        <div class="column"><span>电话:</span> {{ userInfo.tel }}</div>
        <div class="column"><span>会员等级:</span> {{ formatVip(userInfo.vip_level) }}</div>
        <div class="column"><span>会员余额:</span> ￥{{ userInfo.sum }}</div>
        <div class="column"><span>来源:</span> {{ userInfo.department }}</div>
      </div>
    </el-card>

    <el-table
      :data="tableData"
      stripe
      style="width: 100%;margin-top:20px;border-radius: 2px;"
    >
      <el-table-column prop="customer_info.nickname" label="客户姓名" show-overflow-tooltip min-width="100" :formatter="customerFilter" />
      <el-table-column prop="type" label="日志类型" show-overflow-tooltip min-width="100" :formatter="formatFilter" />
      <el-table-column prop="sum" label="余额" show-overflow-tooltip min-width="100" />
      <el-table-column prop="consume_sum" label="消费金额" show-overflow-tooltip min-width="100" />
      <el-table-column prop="recharge_sum" label="充值金额" show-overflow-tooltip min-width="100" />
      <el-table-column prop="user_info.nickname" label="操作人" show-overflow-tooltip min-width="100" />
      <el-table-column prop="create_at" label="时间" show-overflow-tooltip min-width="100" :formatter="parseTime" />
    </el-table>
    <div class="page-box">
      <el-pagination
        :current-page="pageMsg.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageMsg.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { vip_level, logsType } from '@/utils/formatter'
import { parseTime } from '@/utils/index'
export default {
  name: 'CustomerInfo',
  components: {
  },
  data() {
    return {
      userInfo: {},
      pageMsg: {
        page: 1,
        pageSize: 10
      },
      tableData: [],
      totalNum: 1,
      currentRow: null
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    customerFilter(row, column, val, index) {
      return val || '散客'
    },
    formatVip(val) {
      const vip = vip_level.find(v => v.value === val)
      if (!vip) {
        return '-'
      } else {
        return vip.label
      }
    },
    parseTime(row, column, val, index) {
      return parseTime(val, '{y}-{m}-{d} {h}:{i}')
    },
    formatFilter(row, column, val, index) {
      const list = logsType.find(v => v.value === val)
      if (list) {
        return list.label
      } else {
        return val
      }
    },
    getUserInfo() {
      const params = {
        _id: this.$route.query.id
      }
      this.$ajax.vpost('/customer/info', params).then(res => {
        this.userInfo = res.userinfo
        this.getList()
      })
    },
    getList() {
      const params = {
        condition: { customer_id: this.userInfo.customer_id },
        ...this.pageMsg
      }
      this.$ajax.vpost('/logs/list', params).then(res => {
        this.tableData = res.list.map(v => ({
          ...v,
          ...v.obj
        }))
        this.totalNum = res.totalNum
      })
    },
    handleSizeChange(val) {
      this.pageMsg.page = 1
      this.pageMsg.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.pageMsg.page = val
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
  .content-box {
    padding: 20px;
    background-color: rgb(240, 242, 245);
    position: relative;
    .box-card {
      .card-header {
        span {
          font-weight: 600;font-size:20px;
        }
      }
      .card-content {
        display: flex;flex-wrap: wrap;
        .column {
          width: 50%;line-height:40px;
          span {
            font-weight: 600;
          }
        }
      }
    }
    .page-box {
      text-align: center;
      margin-top:20px;
    }
  }
</style>
