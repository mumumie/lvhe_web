<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" :class="{active: activeIndex === 4}" @click="handleSetLineChartData(4)">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            月散户消费
          </div>
          <count-to :start-val="0" :end-val="totalFilter(4, 'consumeTotal')" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" :class="{active: activeIndex === 1}" @click="handleSetLineChartData(1)">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="message" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            月新增充值
          </div>
          <count-to :start-val="0" :end-val="totalFilter(1, 'rechargeTotal')" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" :class="{active: activeIndex === 3}" @click="handleSetLineChartData(3)">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            月会员充值
          </div>
          <count-to :start-val="0" :end-val="totalFilter(3, 'rechargeTotal')" :duration="3200" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" :class="{active: activeIndex === 2}" @click="handleSetLineChartData(2)">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="shopping" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            月会员消费
          </div>
          <count-to :start-val="0" :end-val="totalFilter(2, 'consumeTotal')" :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import { mapGetters } from 'vuex'

export default {
  components: {
    CountTo
  },
  data() {
    return {
      activeIndex: 1,
      consumeTotal: []
    }
  },
  computed: {
    ...mapGetters([
      'userinfo'
    ])
  },
  created() {
    this.monthConsumeTotal()
  },
  methods: {
    totalFilter(index, field = 'consumeTotal') {
      const row = this.consumeTotal.find(v => v._id === index)
      if (row) {
        return row[field]
      } else {
        return 0
      }
    },
    monthConsumeTotal() {
      this.$ajax.vpost('/logs/monthConsumeTotal', { date: this.getCurrentDate(), operator_dpt: this.userinfo.department }).then(res => {
        this.consumeTotal = res.list
      })
    },
    getCurrentDate(type = 'current') {
      const date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let lastTime
      if (type === 'previous') {
        if (month !== 1) {
          month--
        } else {
          month = 12
          year -= 1
        }
        if (month < 10) {
          month = '0' + month
        }
      }
      if (month === 12) {
        lastTime = new Date(`${year + 1}-01`).getTime()
      } else {
        lastTime = new Date(`${year}-${Number(month) + 1}`).getTime()
      }
      const time = new Date(`${year}-${month}`).getTime()
      return [time, lastTime]
    },
    handleSetLineChartData(type) {
      this.activeIndex = type
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover, &.active {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
