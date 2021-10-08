import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom'
import qs from 'query-string'
import cx from 'classnames'
import dayjs from 'dayjs';
import Header from '@/components/Header'
import CustomIcon from '@/components/CustomIcon';
import PopupAddBill from '@/components/PopupAddBill';
import { Modal, Toast } from 'zarm';
import { get, post, typeMap } from '@/utils'
import Style from './style.module.less'

const Detail = () => {
  const addRef = useRef()
  const location = useLocation(); // 获取 locaton 实例。
  const history = useHistory() // 获取 history 实例。
  const { id } = qs.parse(location.search) // 查询字符串反序列化
  const [detail, setDetial] = useState({}) // 订单详情数据

  useEffect(() => {
    getDetail()
  }, [])

  const getDetail = async () => {
    const { data } = await get(`/api/bill/detail?id=${id}`)
    setDetial(data)
  }

  // 删除方法
  const deleteDetail = () => {
    Modal.confirm({
      title: '删除',
      content: '确认删除账单？',
      onOk: async () => {
        const { data } = await post('/api/bill/delete', { id })
        Toast.show('删除成功')
        history.goBack()
      }
    })
  }

  // 打开编辑弹窗方法
  const openModal = () => {
    addRef.current.show()
  }

  return (
    <div className={Style.detail}>
      <Header title="账单详情" />
      <div className={Style.card}>
        <div className={Style.type}>
          {/* 通过 pay_type 属性，判断是收入或指出，给出不同的颜色*/}
          <span className={cx({[Style.expense]: detail.pay_type == 1, [Style.income]: detail.pay_type == 2})}>
            {/* typeMap 是我们事先约定好的 icon 列表 */}
            <CustomIcon className={Style.iconfont} type={detail.type_id ? typeMap[detail.type_id].icon : 1} />
          </span>
          <span>{detail.type_name || ''}</span>
        </div>
        {
          detail.pay_type == 1
            ? <div className={cx(Style.amount, Style.expense)}>-{detail.amount}</div>
            : <div className={cx(Style.amount, Style.income)}>+{detail.amount}</div>
        }
        <div className={Style.info}>
          <div className={Style.time}>
            <span>记录时间</span>
            <span>{dayjs(Number(detail.date)).format('YYYY-MM-DD HH:mm')}</span>
          </div>
          <div className={Style.remark}>
            <span>备注</span>
            <span>{detail.remark || '-'}</span>
          </div>
        </div>
        <div className={Style.operation}>
          <span onClick={deleteDetail} ><CustomIcon  className={Style.iconfont} type="icon-shanchu"/>删除</span>
          <span onClick={openModal} ><CustomIcon className={Style.iconfont} type="icon-bianji"/>编辑</span>
        </div>
      </div>
      <PopupAddBill ref={addRef} detail={detail} onReload={getDetail} />
    </div>
  )
}

export default Detail