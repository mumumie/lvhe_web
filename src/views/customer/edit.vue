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
        <el-select v-model="ruleForm.vip_level" placeholder="请选择会员等级">
          <el-option
            v-for="item in vip_level"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
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
const defaultForm = {
  nickname: '',
  tel: '',
  department: '南湖店',
  vip_level: 0,
  sum: 0,
  remark: ''
}
export default {
  props: ['switchBtn', 'dataInfo'],
  data() {
    return {
      dialogVisible: false,
      ruleForm: {
        nickname: '',
        tel: '',
        department: '南湖店',
        vip_level: 0,
        sum: 0,
        remark: ''
      },
      rules: {
        nickname: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        tel: [
          { required: true, message: '请输入电话', trigger: 'blur' }
        ],
        vip_level: [
          { required: true, message: '请选择会员等级', trigger: 'change' }
        ],
        department: [
          { required: true, message: '请选择店铺', trigger: 'change' }
        ],
        sum: [
          { required: true, message: '请选择店铺', trigger: 'change' }
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
            this.ruleForm = Object.assign(defaultForm)
          }
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
          const params = Object.assign(this.ruleForm, { userid: this.userinfo._id })
          let url = '/customer/add'
          if (params._id) {
            url = '/customer/edit'
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
