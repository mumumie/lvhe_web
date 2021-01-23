<template>
  <div class="content-box">
    <el-form ref="ruleForm" :model="ruleForm" inline class="demo-ruleForm">
      <el-form-item label="">
        <el-input v-model="ruleForm.nickname" placeholder="姓名" />
      </el-form-item>
      <el-form-item label="">
        <el-input v-model="ruleForm.tel" placeholder="电话" />
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="getList">查询</el-button>
      </el-form-item>
      <el-form-item style="float:right;">
        <el-button type="warning" @click="editHandle({}, 4)">散客消费</el-button>
        <el-button type="primary" @click="editHandle({})">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      stripe
      class="customer-table"
      style="width: 100%"
      @row-click="customerClick"
    >
      <el-table-column prop="customer_id" label="ID" show-overflow-tooltip min-width="130" />
      <el-table-column prop="nickname" label="姓名" show-overflow-tooltip min-width="80" />
      <el-table-column prop="tel" label="电话" show-overflow-tooltip min-width="100" />
      <el-table-column prop="sum" label="金额" show-overflow-tooltip min-width="100" />
      <el-table-column prop="vip_level" label="会员" show-overflow-tooltip min-width="80" :formatter="(a,b,c) => formatVip(c)" />
      <el-table-column prop="department" label="店铺" show-overflow-tooltip min-width="100" />
      <el-table-column prop="introduction" label="备注" show-overflow-tooltip min-width="100" />
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click.stop="editHandle(scope.row, 3)">消费</el-button>
          <el-button type="text" size="mini" @click.stop="editHandle(scope.row, 2)">充值</el-button>
          <el-button type="text" size="mini" @click.stop="editHandle(scope.row, 1)">编辑</el-button>
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
      :user-list="userList"
      :switch-btn="editSwitch"
      @close="editSwitch = false"
      @success="getList"
    />
    <!--    扣款 升级-->
    <consume-edit
      :data-info="currentRow"
      :user-list="userList"
      :switch-btn="consumeSwitch"
      @close="consumeSwitch = false"
      @success="getList"
    />
    <!--    散户消费 -->
    <consume-general
      :switch-btn="generalSwitch"
      :user-list="userList"
      @close="generalSwitch = false"
    />
  </div>
</template>

<script>
import { vip_level } from '@/utils/formatter'
export default {
  name: 'Customer',
  components: {
    UserEdit: () => import('./edit'),
    ConsumeEdit: () => import('./consume-edit'),
    ConsumeGeneral: () => import('./consume-general')
  },
  data() {
    return {
      ruleForm: {
        nickname: '',
        tel: ''
      },
      pageMsg: {
        page: 1,
        pageSize: 10
      },
      tableData: [],
      totalNum: 1,
      currentRow: null,
      editSwitch: false,
      consumeSwitch: false,
      generalSwitch: false,
      userList: []
    }
  },
  created() {
    this.getList()
    this.getUserAll()
  },
  methods: {
    formatVip(val) {
      const vip = vip_level.find(v => v.value === val)
      if (!vip) {
        return '-'
      } else {
        return vip.label
      }
    },
    customerClick(row) {
      this.$router.push({ path: '/customer/info', query: { id: row._id }})
    },
    editHandle(row, type) {
      if (type === 1) {
        this.currentRow = JSON.parse(JSON.stringify(row))
        this.editSwitch = true
      } else if (type === 2 || type === 3) {
        this.currentRow = JSON.parse(JSON.stringify({ ...row, type }))
        this.consumeSwitch = true
      } else if (type === 4) {
        this.generalSwitch = true
      } else {
        this.currentRow = {}
        this.editSwitch = true
      }
    },
    delelteHandle(row) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$ajax.vpost('/customer/delete', { id: row._id }).then(res => {
          this.$message.success('删除成功')
          this.getList()
        })
      }).catch(() => {
      })
    },
    getList() {
      const params = {
        condition: this.ruleForm,
        ...this.pageMsg
      }
      this.$ajax.vpost('/customer/list', params).then(res => {
        this.tableData = res.list
        this.totalNum = res.totalNum
      })
    },
    getUserAll() {
      const params = {
        condition: {
          username: { $ne: 'admin'}
        },
        showObj: {
          password: 0
        },
        page: 1,
        pageSize: 10
      }
      this.$ajax.vpost('/user/list', params).then(res => {
        this.userList = res.list
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
