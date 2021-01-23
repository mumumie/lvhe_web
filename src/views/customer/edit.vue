<template>
  <el-dialog
    :title="isEdit ? '编辑会员' : '新增会员'"
    :visible.sync="switchBtn"
    width="500px"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" class="demo-ruleForm">
      <el-form-item v-if="isEdit" label="ID">
        <el-input v-model="ruleForm.customer_id" :disabled="isEdit" />
      </el-form-item>
      <el-form-item label="姓名" prop="nickname">
        <el-input v-model="ruleForm.nickname" />
      </el-form-item>
      <el-form-item label="电话" prop="tel">
        <el-input v-model="ruleForm.tel" />
      </el-form-item>
      <el-form-item label="金额" prop="sum">
        <el-input v-model="ruleForm.sum" :disabled="isEdit">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="会员" prop="vip_level">
        <el-select v-model="ruleForm.vip_level" placeholder="请选择会员等级" :disabled="isEdit" style="width: 100%;">
          <el-option
            v-for="item in vip_level"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="店铺名" prop="department">
        <el-select v-model="ruleForm.department" placeholder="请选择店铺" :disabled="isEdit" style="width: 100%;">
          <el-option
            v-for="(item, index) in departmentList"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="销售人员" prop="userid">
        <el-select v-model="ruleForm.userid" placeholder="请选择销售人员" :disabled="isEdit" style="width: 100%;">
          <el-option
            v-for="item in userList"
            :key="item.user_id"
            :label="item.nickname"
            :value="item.user_id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="ruleForm.remark" type="textarea" placeholder="备注..." :rows="3" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { vip_level, department } from '@/utils/formatter'
import { mapGetters } from 'vuex'

const defaultForm = () => ({
  nickname: '',
  tel: '',
  department: '南湖店',
  vip_level: 0,
  sum: 0,
  remark: '',
  userid: ''
})

export default {
  props: ['switchBtn', 'dataInfo', 'userList'],
  data() {
    const checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    const isNum = (rule, value, callback) => {
      if (isNaN(value)) {
        return callback(new Error('请输入数字'))
      } else if (Number(value) <= 0) {
        return callback(new Error('请输入大于0的数'))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: false,
      ruleForm: defaultForm(),
      rules: {
        nickname: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        tel: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
        vip_level: [
          { required: true, message: '请选择会员等级', trigger: 'change' }
        ],
        department: [
          { required: true, message: '请选择店铺', trigger: 'change' }
        ],
        sum: [
          { required: true, message: '输入金额', trigger: 'blur' },
          { validator: isNum, trigger: 'blur' }
        ],
        userid: [
          { required: true, message: '请选择销售人员', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    switchBtn: {
      handler(val) {
        if (val) {
          if (this.dataInfo._id) {
            this.ruleForm = this.dataInfo
          } else {
            this.ruleForm = defaultForm()
          }
          this.ruleForm.userid = this.userinfo.user_id
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'userinfo'
    ]),
    vip_level() {
      return vip_level
    },
    departmentList() {
      return department
    },
    isEdit() {
      return !!this.ruleForm._id
    }
  },
  methods: {
    handleClose(done) {
      this.$emit('close')
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = Object.assign({
            operator_id: this.userinfo.user_id,
            operator_dpt: this.userinfo.department
          }, this.ruleForm)
          let url = '/customer/add'
          if (params._id) {
            url = '/customer/edit'
          } else {
            params.userid = this.userinfo.user_id
          }
          this.$ajax.vpost(url, params).then(res => {
            this.$message.success(params._id ? '编辑成功' : '新增成功！')
            this.$emit('close')
            this.$emit('success')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
