<template>
  <el-dialog
    :title="isEdit ? '会员充值' : '消费金额'"
    :visible.sync="switchBtn"
    width="500px"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" class="demo-ruleForm">
      <el-form-item label="销售人员" prop="userid">
        <el-select v-model="ruleForm.userid" placeholder="请选择销售人员" style="width: 100%;">
          <el-option
            v-for="item in userList"
            :key="item.user_id"
            :label="item.nickname"
            :value="item.user_id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="账户余额">
        <el-input v-model="ruleForm.sum" :disabled="true">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item v-if="!isEdit" label="消费金额" prop="consume">
        <el-input v-model="ruleForm.consume">
          <template slot="append">{{ discount(ruleForm.vip_level) * 10 }} 折</template>
        </el-input>
      </el-form-item>
      <el-form-item v-if="!isEdit" label="实际扣款">
        <div>{{ isNaN(ruleForm.consume) ? 0 : (ruleForm.consume * discount(ruleForm.vip_level)).toFixed(2) }} 元</div>
      </el-form-item>
      <el-form-item v-if="isEdit" label="会员" prop="vip_level">
        <el-select v-model="ruleForm.vip_level" placeholder="请选择会员等级" style="width: 100%;">
          <el-option
            v-for="item in vip_level"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
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
import { discount, vip_level } from '@/utils/formatter'
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
    const isNum = (rule, value, callback) => {
      const consume = /^[0-9]*$/
      if (!consume.test(value)) {
        callback(new Error('金额只能为整数'))
      } else if (Number(value) <= 0) {
        return callback(new Error('请输入大于0的数'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: defaultForm(),
      rules: {
        consume: [
          { required: true, message: '请输入金额', trigger: 'blur' },
          { validator: isNum, trigger: 'blur' }
        ],
        vip_level: [
          { required: true, message: '请选择会员等级', trigger: 'change' }
        ],
        userid: [
          { required: true, message: '请选择销售人员', trigger: 'change' }
        ]
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
    isEdit() {
      if (this.dataInfo && this.dataInfo.type === 2) {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    switchBtn(val) {
      if (val) {
        if (this.dataInfo._id) {
          this.ruleForm = this.dataInfo
        } else {
          this.ruleForm = defaultForm()
        }
        this.$set(this.ruleForm, 'userid', this.userinfo.user_id)
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
          const dpt = this.userList.find(v => v.user_id === this.ruleForm.userid)
          const params = Object.assign({
            operator_id: this.userinfo.user_id,
            operator_dpt: dpt.department
          }, this.ruleForm)
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
