export const roleFilter = (row, column, value, index) => {
  switch (value) {
    case 1:
      return '管理员'
    case 2:
      return '员工'
    default:
      return '-'
  }
}

// 会员等级折扣
export const discount = (val) => {
  switch (val) {
    case 0:
      return 0.85
    case 1:
      return 0.7
    case 2:
      return 0.65
    case 3:
      return 0.6
    case 4:
      return 0.55
    default:
      return 1
  }
}

export const vip_level = [
  { label: '学生卡', value: 0 },
  { label: '银卡', value: 1 },
  { label: '金卡', value: 2 },
  { label: '白金卡', value: 3 },
  { label: '至尊卡', value: 4 }
]

export const logsType = [
  { label: '会员新增', value: 1 },
  { label: '会员消费', value: 2 },
  { label: '会员充值', value: 3 },
  { label: '散客消费', value: 4 }
]

export const department = [
  '南湖店',
  '光谷店'
]
