<template>
  <div class="content-box">
    <el-form ref="ruleForm" :model="ruleForm" inline class="demo-ruleForm">
      <el-form-item label="" prop="name">
        <el-input v-model="ruleForm.username" placeholder="账号" />
      </el-form-item>
      <!--      <el-form-item label="" prop="role">-->
      <!--        <el-select v-model="ruleForm.role" clearable placeholder="角色">-->
      <!--          <el-option label="管理员" :value="1" />-->
      <!--          <el-option label="店员" :value="2" />-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->
      <el-form-item>
        <el-button type="danger" @click="getList">查询</el-button>
      </el-form-item>
      <el-form-item style="float:right;">
        <el-button type="primary" @click="editHandle({})">新增</el-button>
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
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="editHandle(scope.row, 1)">编辑</el-button>
          <!--          <el-button type="text" @click="delelteHandle(scope.row)">删除</el-button>-->
        </template>
      </el-table-column>
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
    <!--    新增编辑-->
    <user-edit
      :data-info="currentRow"
      :switch-btn="!!currentRow"
      @close="currentRow = null"
      @success="getList"
    />
  </div>
</template>

<script>
import { roleFilter } from '@/utils/formatter'
export default {
  name: 'User',
  components: {
    UserEdit: () => import('./edit')
  },
  data() {
    return {
      ruleForm: {
        username: ''
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
    roleFilter(row, column, val) {
      return roleFilter(row, column, val)
    },
    editHandle(row, type) {
      if (type) {
        this.currentRow = JSON.parse(JSON.stringify(row))
      } else {
        this.currentRow = {}
      }
    },
    delelteHandle(row) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$ajax.vpost('/user/delete', { id: row._id }).then(res => {
          this.$message.success('删除成功')
          this.getList()
        })
      }).catch(() => {
      })
    },
    getList() {
      const params = {
        condition: {
          username: { $regex: this.ruleForm.username }
        },
        ...this.pageMsg
      }
      this.$ajax.vpost('/user/list', params).then(res => {
        this.tableData = res.list
        this.totalNum = res.totalNum
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageMsg.page = 1
      this.pageMsg.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
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
    height: calc(100vh - 90px);
    .page-box {
      text-align: center;
      margin-top:20px;
    }
  }
</style>
