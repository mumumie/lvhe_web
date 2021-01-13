<template>
  <el-dialog
    :title="isEdit ? '会员充值' : '消费金额'"
    :visible.sync="switchBtn"
    width="500px"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" class="demo-ruleForm">
      <el-form-item label="账户余额">
        <el-input v-model="ruleForm.sum" :disabled="isEdit">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item v-if="!isEdit" label="消费金额" prop="consume">
        <el-input v-model="ruleForm.consume">
          <template slot="append">{{ discount(ruleForm.vip_level) * 10 }} 折</template>
        </el-input>
      </el-form-item>
      <el-form-item v-if="!isEdit" label="实际扣款">
        <div>{{ ruleForm.consume ? ruleForm.consume * discount(ruleForm.vip_level) : 0 }} 元</div>
      </el-form-item>
      <el-form-item v-if="isEdit" label="会员" prop="vip_level">
        <el-select v-model="ruleForm.vip_level" placeholder="请选择会员等级">
          <el-option label="银卡" :value="0" />
          <el-option label="金卡" :value="1" />
          <el-option label="白金卡" :value="2" />
          <el-option label="至尊卡" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="isEdit" label="充值金额" prop="consume">
        <el-input v-model="ruleForm.consume">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { discount } from '@/utils/formatter'
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
    const isNum = (rule, value, callback) => {
      const consume = /^[0-9]*$/
      if (!consume.test(value)) {
        callback(new Error('消费金额只能为整数'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {},
      rules: {
        consume: [
          { required: true, message: '请输入消费金额', trigger: 'blur' },
          { validator: isNum, trigger: 'blur' }
        ],
        vip_level: [
          { required: true, message: '请选择会员等级', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    isEdit() {
      if (this.dataInfo && this.dataInfo.type === 2) {
        return true
      } else {
        return false
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
  methods: {
    discount(val) {
      return discount(val)
    },
    handleClose(done) {
      this.$emit('close')
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = this.ruleForm
          let url = '/customer/consume'
          if (this.isEdit) {
            url = '/customer/recharge'
          } else {
            if (params.sum < params.consume * this.discount(params.vip_level)) {
              this.$message.error('余额不足，请先充值！')
              return
            }
          }
          this.$ajax.vpost(url, params).then(res => {
            this.$message.success(this.isEdit ? '充值成功' : '扣款成功！')
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
