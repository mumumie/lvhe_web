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
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: ['switchBtn', 'userList'],
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
        consume: '',
        userid: ''
      },
      rules: {
        consume: [
          { required: true, message: '请输入消费金额', trigger: 'blur' },
          { validator: isNum, trigger: 'blur' }
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
    ])
  },
  watch: {
    switchBtn: {
      handler(val) {
        if (val) {
          this.ruleForm = {
            consume: '',
            userid: this.userinfo.user_id
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
          const params = Object.assign({}, this.ruleForm)
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
