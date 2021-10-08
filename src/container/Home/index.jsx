import React, { useEffect, useRef, useState } from 'react'
import { Icon, Pull } from 'zarm'
import dayjs from 'dayjs';
import CustomIcon from '@/components/CustomIcon'
import BillItem from '@/components/BillItem'
import PopupType from '@/components/PopupType'
import PopupDate from '@/components/PopupDate'
import PopupAddBill from '@/components/PopupAddBill'
import Empty from '@/components/Empty'
import { get, REFRESH_STATE, LOAD_STATE } from '@/utils' // Pull 组件需要的一些常量

import Style from './style.module.less'

const Home = () => {
  // const [list, setList] = useState([
  //   {
  //     bills: [
  //       {
  //         amount: "25.00",
  //         date: "1623390740000",
  //         id: 911,
  //         pay_type: 1,
  //         remark: "",
  //         type_id: 1,
  //         type_name: "餐饮"
  //       }
  //     ],
  //     date: '2021-06-11'
  //   }
  // ]); 

  const typeRef = useRef() // 账单类型ref
  const monthRef = useRef() // 月份筛选 ref
  const addRef = useRef(); // 添加账单 ref
  const [totalExpense, setTotalExpense] = useState(0); // 总支出
  const [totalIncome, setTotalIncome] = useState(0); // 总收入
  const [ currentSelect, setCurrentSelect ] = useState({}) // 当前筛选
  const [ currentTime, setCurrentTime ] = useState(dayjs().format('YYYY-MM')) // 当前筛选时间
  const [ page, setPage ] = useState(1) // 分页
  const [ list, setList ] = useState([]) // 账单列表
  const [ totalPage, setTotalPage ] = useState(0) // 分页总数
  const [ refreshing, setRefreshing ] = useState(REFRESH_STATE.normal) // 下拉刷新状态
  const [ loading, setLoading ] = useState(LOAD_STATE.normal) // 上拉加载状态

  useEffect(() => {
    getBillList() // 初始化
  }, [page, currentSelect, currentTime])

  // 获取账单方法
  const getBillList = async () => {
    const { data } = await get(`/api/bill/list?page=${page}&page_size=5&date=${currentTime}&type_id=${currentSelect.id || 'all'}`)
    // 下拉刷新 重制数据
    if (page == 1) {
      setList(data.list)
    } else {
      setList(list.concat(data.list))
    }
    setTotalExpense(data.totalExpense.toFixed(2));
    setTotalIncome(data.totalIncome.toFixed(2));
    setTotalPage(data.totalPage)
    // 上滑加载状态
    setLoading(LOAD_STATE.success)
    setRefreshing(REFRESH_STATE.success)
  }

  // 请求列表数据
  const refreshData = () => {
    setRefreshing(REFRESH_STATE.loading)
    if (page != 1) {
      setPage(1)
    } else {
      getBillList()
    }
  }

  const loadData = () => {
    if (page < totalPage) {
      setLoading(LOAD_STATE.loading)
      setPage(page + 1)
    }
  }

  // 添加账单弹窗
  const toggle = () => {
    typeRef.current && typeRef.current.show()
  }

  // 筛选类型
  const select = (item) => {
    setRefreshing(REFRESH_STATE.loading)
    // 触发刷新列表，将分页重制为1
    setPage(1)
    setCurrentSelect(item)
  }

  // 选择月份
  const monthToggle = () => {
    monthRef.current && monthRef.current.show()
  }
  // 筛选月份
  const selectMonth = (item) => {
    setRefreshing(REFRESH_STATE.loading);
    setPage(1);
    // 当没有选择时间时点击确认按钮
    if (currentTime == item) {
      getBillList()
    }
    setCurrentTime(item)
  }

  // 新增按钮
  const addToggle = () => {
    addRef.current && addRef.current.show()
  }

  return (
    <div className={Style.home}>
      <div className={Style.header}>
        <div className={Style.dataWrap}>
          <span className={Style.expense}>总支出：<b>¥ { totalExpense }</b></span>
          <span className={Style.income}>总收入：<b>¥ { totalIncome }</b></span>
        </div>
        <div className={Style.typeWrap}>
          <div className={Style.left} onClick={toggle}>
            <span className={Style.title}>{currentSelect.name || '全部类型'}<Icon className={Style.arrow} type="arrow-bottom" /></span>
          </div>
          <div className={Style.right}>
            <span className={Style.time} onClick={monthToggle}>{currentTime}<Icon className={Style.arrow} type="arrow-bottom" /></span>
          </div>
        </div>
      </div>
      <div className={Style.contentWrap}>
        {
          list.length ? <Pull
            animationDuration = {200}
            stayTime = {400}
            refresh = {{
              state: refreshing,
              handler: refreshData
            }}
            load = {{
              state: loading,
              distance: 200,
              handler: loadData
            }}
          >
            {
              list.map((item, index) => <BillItem bill={item} key={index} />)
            }   
          </Pull> : <Empty />
        }
      </div>
      <div className={Style.add} onClick={addToggle}><CustomIcon type='icon-bianji' /></div>
      <PopupType ref={typeRef} onSelect={select} />
      <PopupDate ref={monthRef} onSelect={selectMonth} />
      <PopupAddBill ref={addRef} onReload={refreshData} />
    </div>
  )
}

export default Home