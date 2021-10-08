import React, { useState } from 'react';
import PropsTypes from 'prop-types'
import { TabBar } from 'zarm'
import { useHistory } from 'react-router-dom'
import Style from './style.module.less'
import CustomIcon from '../CustomIcon'

const NavBar = ({ showNav }) => {
  const [ activeKey, setActiveKey ] = useState('/')
  const history = useHistory()

  const changeTab = (path) => {
    setActiveKey(path)
    history.push(path)
  }

  return (
    <TabBar visible={showNav} className={Style.tab} activeKey={activeKey} onChange={changeTab}>
      <TabBar.Item itemKey="/" title="账单" icon={<CustomIcon type="icon-zhangdan" />} />
      <TabBar.Item itemKey="/data" title="统计" icon={<CustomIcon type="icon-tongji" />} />
      <TabBar.Item itemKey="/user" title="我的" icon={<CustomIcon type="icon-gerenzhongxin" />} />
    </TabBar>
  )
}

NavBar.propsTypes = {
  showNav: PropsTypes.bool
}

export default NavBar