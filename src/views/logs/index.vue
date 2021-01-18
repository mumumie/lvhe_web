<template>
  <div class="content-box">
    <el-form ref="ruleForm" :model="ruleForm" inline class="demo-ruleForm">
      <el-form-item label="" prop="name">
        <el-select v-model="ruleForm.type" clearable placeholder="类型">
          <el-option
            v-for="item in logsType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%"
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
import { roleFilter, logsType } from '@/utils/formatter'
import { parseTime } from '@/utils/index'
export default {
  name: 'Logs',
  data() {
    return {
      ruleForm: {
        type: ''
      },
      pageMsg: {
        page: 1,
        pageSize: 10
      },
      tableData: [],
      totalNum: 1,
      currentRow: null
    }
  },
  computed: {
    logsType() {
      return logsType
    }
  },
  created() {
    this.getList()
  },
  methods: {
    customerFilter(row, column, val, index) {
      return val || '散客'
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
    search() {
      this.pageMsg.page = 1
      this.getList()
    },
    roleFilter(row, column, val) {
      return roleFilter(row, column, val)
    },
    getList() {
      const params = { ...this.pageMsg }
      if (this.ruleForm.type) {
        params.condition = {
          type: {
            '$in': [this.ruleForm.type]
          }
        }
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
    .page-box {
      text-align: center;
      margin-top:20px;
    }
  }
</style>
