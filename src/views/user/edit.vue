<template>
  <el-dialog
    :title="isEdit ? '编辑用户' : '新增用户'"
    :visible.sync="switchBtn"
    width="500px"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" class="demo-ruleForm">
      <el-form-item label="账号" prop="username">
        <el-input v-model="ruleForm.username" :disabled="isEdit" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm.password" show-password />
      </el-form-item>
      <el-form-item label="姓名" prop="nickname">
        <el-input v-model="ruleForm.nickname" />
      </el-form-item>
      <el-form-item label="电话" prop="tel">
        <el-input v-model="ruleForm.tel" />
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select v-model="ruleForm.role" placeholder="请选择角色">
          <el-option label="管理员" :value="1" />
          <el-option label="员工" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="店铺名" prop="department">
        <el-select v-model="ruleForm.department" placeholder="请选择店铺">
          <el-option
            v-for="(item, index) in departmentList"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="introduction">
        <el-input v-model="ruleForm.introduction" type="textarea" placeholder="备注..." :rows="3" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { department } from '@/utils/formatter'
const defaultForm = () => ({
  username: '',
  password: '',
  nickname: '',
  tel: '',
  role: 2,
  department: '南湖店',
  introduction: ''
})

export default {
  props: ['switchBtn', 'dataInfo'],
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
    return {
      dialogVisible: false,
      ruleForm: defaultForm(),
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        tel: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
        role: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ],
        department: [
          { required: true, message: '请选择店铺', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    departmentList() {
      return department
    },
    isEdit() {
      return !!this.ruleForm._id
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
        }
      }
    }
  },
  methods: {
    handleClose(done) {
      this.$emit('close')
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = this.ruleForm
          let url = '/user/add'
          if (params._id) {
            url = '/user/edit'
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
