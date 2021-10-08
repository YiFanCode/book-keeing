import React, { useEffect, useRef, useState } from 'react'
import { Icon, Progress } from 'zarm'
import cx from 'classnames'
import dayjs from 'dayjs'
import CustomIcon from '@/components/CustomIcon'
import PopupDate from '../../components/PopupDate'

import { get, typeMap } from '@/utils'

import Style from './style.module.less'

let proportionChart = null; // 用于存放 echart 初始化返回的实例

const Data = () => {
  const monthRef = useRef();
  const [ currentMonth, setCurrentMonth ] = useState(dayjs().format('YYYY-MM')) //当前日期
  const [ totalType, setTotalType ] = useState('expense') // 收入或支出类型
  const [ totalExpense, setTotalExpense ] = useState(0) // 总支出
  const [ totalIncome, setTotalIncome ] = useState(0) // 总收入
  const [ expenseData, setExpensData ] = useState([]) // 支出数据
  const [ incomeData, setIncomeData ] = useState([]) // 收入数据

  const [pieType, setPieType] = useState('expense'); // 饼图的「收入」和「支出」控制

  useEffect(() => {
    getData()
    return () => {
      // 每次组件卸载的时候，需要释放图表实例。clear 只是将其清空不会释放。
      proportionChart.dispose()
    }
  }, [currentMonth])

  // 获取数据详情
  const getData = async () => {
    const { data } = await get(`/api/bill/data?date=${currentMonth}`)
    // 总收支
    setTotalExpense(data.total_expense)
    setTotalIncome(data.total_income)
    // 过滤支出和收入
    const expense_data = data.total_data.filter((item) => {
      return item.pay_type == 1
    }).sort((a, b) => b.number - a.number) // 过滤出账单类型为支出的项
    const income_data = data.total_data.filter((item) => {
      return item.pay_type == 2
    }).sort((a, b) => b.number - a.number) // 过滤出账单类型为收入的项
    setExpensData(expense_data)
    setIncomeData(income_data)

    // 绘制饼图
    setPieChart(pieType == 'expense' ? expense_data: income_data )
  }

  // 切换饼图收支类型
  const changePieType = (type) => {
    setPieType(type)
    // 重绘饼图
    setPieChart(type == 'expense' ? expenseData : incomeData)
  }

  // 切换饼图收支类型
  const changeTotalType = (type) => {
    setTotalType(type)
  }

  // 月份弹窗
  const monthShow = () => {
    monthRef.current && monthRef.current.show()
  }
  // 选择时间函数
  const selectMonth = (item) => {
    setCurrentMonth(item)
  }

  // 绘制饼图方法
  const setPieChart = (data) => {
    if (window.echarts) {
      // 初始化饼图，返回实例。
      proportionChart = echarts.init(document.getElementById('proportion'))
      proportionChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        // 图例
        legend: {
          data: data.map(item => item.type_name)
        },
        series: [
          {
            name: '支出',
            type: 'pie',
            radius: '55%',
            data: data.map(item => {
              return {
                value: item.number,
                name: item.type_name
              }
            }),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    } 
  }

  return (
    <div className={Style.data}>
      <div className={Style.total}>
        <div className={Style.time} onClick={monthShow}>
          <span>{currentMonth}</span>
          <Icon className={Style.date} type="date" />
        </div>
        <div className={Style.title}>共支出</div>
        <div className={Style.expense}>￥{totalExpense}</div>
        <div className={Style.income}>共收入￥{totalIncome}</div>
      </div>

      <div className={Style.structure}>
        <div className={Style.head}>
          <span className={Style.title}>收支构成</span>
          <div className={Style.tab}>
            <span onClick={() => changeTotalType('expense')} className={cx({[Style.expense]: true, [Style.active]: totalType == 'expense'})}>支出</span>
            <span onClick={() => changeTotalType('income')} className={cx({[Style.income]: true, [Style.active]: totalType == 'income'})}>收入</span>
          </div>
        </div>

        <div className={Style.content}>
          {
            (totalType == 'expense' ? expenseData: incomeData).map((item) => (
              <div key={item.type_id} className={Style.item}>
                <div className={Style.left}>
                  <div className={Style.type}>
                    <span className={cx({[Style.expense]: totalType=='expense', [Style.income]: totalType == 'income'})}>
                      <CustomIcon className={Style.iconfont} type={item.type_id ? typeMap[item.type_id].icon: 1} />
                    </span>
                    <span className={Style.name}>{item.type_name}</span>
                  </div>
                  <div className={Style.progress}>￥{Number(item.number).toFixed(2) || 0}</div>
                </div>

                <div className={Style.right}>
                  <div className={Style.percent}>
                    <Progress 
                      shape="line" 
                      percent={Number((item.number / Number(totalType == 'expense' ? totalExpense : totalIncome))* 100).toFixed(2)}
                      theme="primary"
                    />
                  </div>
                </div>
              </div>
            ))
          }
        </div>
        
        {/* 这是用于放置饼图的 DOM 节点 */}
        <div className={Style.proportion}>
          <div className={Style.head}>
            <span className={Style.title}>收支构成</span>
            <div className={Style.tab}>
              <span 
                onClick={() => changePieType('expense')}
                className={cx({[Style.expense]: true, [Style.active]: pieType == 'expense'})}
              >支出</span>
              <span 
                onClick={() => changePieType('income')}
                className={cx({[Style.income]: true, [Style.active]: pieType == 'income'})}
              >收入</span>
            </div>
          </div>
          <div id="proportion"></div>
        </div>
      </div>

      <PopupDate ref={monthRef} mode="month" onSelect={selectMonth} />
    </div>
  )
}

export default Data