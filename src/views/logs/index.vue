<template>
  <div class="content-box">
    <el-form ref="ruleForm" :model="ruleForm" inline class="demo-ruleForm">
      <el-form-item label="" prop="name">
        <el-select v-model="ruleForm.type" clearable placeholder="类型">
          <el-option label="新增" :value="1" />
          <el-option label="消费" :value="2" />
          <el-option label="充值" :value="3" />
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
      <el-table-column prop="username" label="账号" show-overflow-tooltip min-width="100" />
      <el-table-column prop="nickname" label="姓名" show-overflow-tooltip min-width="100" />
      <el-table-column prop="tel" label="电话" show-overflow-tooltip min-width="100" />
      <el-table-column prop="role" label="角色" show-overflow-tooltip min-width="100" :formatter="roleFilter" />
      <el-table-column prop="department" label="部门" show-overflow-tooltip min-width="100" />
      <el-table-column prop="introduction" label="备注" show-overflow-tooltip min-width="100" />
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
import { roleFilter } from '@/utils/formatter'
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
  created() {
    this.getList()
  },
  methods: {
    search() {
      this.pageMsg.page = 1
      this.getList()
    },
    roleFilter(row, column, val) {
      return roleFilter(row, column, val)
    },
    getList() {
      const params = {...this.pageMsg}
      if (this.ruleForm.type) {
        params.condition = {
          type: {
            '$in': [this.ruleForm.type]
          }
        }
      }
      this.$ajax.vpost('/logs/list', params).then(res => {
        this.tableData = res.list
        this.totalNum = res.totalNum
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    }
  }
}
</script>

<style lang="scss" scoped>
  .content-box {
    padding: 20px;
    background-color: rgb(240, 242, 245);
    position: relative;
    height: calc(100vh - 90px);
    .page-box {
      text-align: center;
      margin-top:20px;
    }
  }
</style>
