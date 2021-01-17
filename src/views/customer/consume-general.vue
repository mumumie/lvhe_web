<template>
  <el-dialog
    title="散客消费"
    :visible.sync="switchBtn"
    width="500px"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" class="demo-ruleForm">
      <el-form-item label="消费金额" prop="consume">
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
import { mapGetters } from "vuex";

export default {
  props: ['switchBtn'],
  data() {
    const isNum = (rule, value, callback) => {
      const consume = /^(([^0][0-9]+|0)\.([0-9]{1,2})$)|^([^0][0-9]+|0)$/
      if (!consume.test(value)) {
        callback(new Error('消费金额只能为数字'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        consume: ''
      },
      rules: {
        consume: [
          { required: true, message: '请输入消费金额', trigger: 'blur' },
          { validator: isNum, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'userinfo'
    ])
  },
  watch: {
    switchBtn: {
      handler(val) {
        if (val) {
          this.ruleForm = {
            consume: ''
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
          const params = Object.assign({ userid: this.userinfo.user_id }, this.ruleForm)
          this.$ajax.vpost('/customer/consumeGeneral', params).then(res => {
            this.$emit('close')
            this.$alert(`成功消费 ￥${params.consume}！`, '消费提示', {
              confirmButtonText: '确定',
              type: 'success',
              callback: action => {
              }
            })
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
