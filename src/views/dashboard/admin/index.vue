<template>
  <div class="dashboard-editor-container">

    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" :xAxis="xAxis" />
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}
const xAxis = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      xAxis: xAxis
    }
  },
  created() {
    this.getStatistics()
  },
  methods: {
    handleSetLineChartData(type) {
      switch (type) {
        case 1:
          this.lineChartData = lineChartData.newVisitis
          break
        case 2:
          this.lineChartData = lineChartData.messages
          break
        case 3:
          this.lineChartData = lineChartData.purchases
          break
        case 4:
          this.lineChartData = lineChartData.shoppings
          break
        default:
          this.lineChartData = lineChartData.newVisitis
      }
    },
    getStatistics() {
      const params = {
        type: 1,
        date: this.getCurrentDate()
      }
      this.$ajax.vpost('/logs/monthCustomer', params).then(res => {
        console.log(res);
      })
    },
    getCurrentDate(type = 'current') {
      const date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let lastTime
      if (type === 'previous') {
        if (month !== 1) {
          month --
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
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 20px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
