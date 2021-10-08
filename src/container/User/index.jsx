import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Cell, Button } from 'zarm'
import { get } from '@/utils'
import Style from './style.module.less'

const User = () => {
  const history = useHistory();
  const [ user, setUser ] = useState({})

  useEffect(() => {
    getUserInfo()
  }, [])

  // 获取用户信息
  const getUserInfo = async () => {
    const { data } = await get(`/api/user/get_userinfo`)
    setUser(data)
  }

  // 退出登录
  const logout = async () => {
    localStorage.removeItem('token');
    history.push('/login');
  };

  return (
    <div className={Style.user}>
      <div className={Style.head}>
        <div className={Style.info}>
          <span>昵称：{user.username || '--'}</span>
          <span>
            <img style={{ width: 30, height: 30, verticalAlign: '-10px' }} src="//s.yezgea02.com/1615973630132/geqian.png" alt="" />
            <b>{user.signature || '暂无个签'}</b>
          </span>
        </div>
        <img className={Style.avatar} style={{ width: 60, height: 60, borderRadius: 8 }} src={user.avatar || ''} alt="" />
      </div>
      <div className={Style.content}>
        <Cell
          hasArrow
          title="用户信息修改"
          onClick={() => history.push('/userinfo')}
          icon={<img style={{width: 20, verticalAlign: '-7px'}} src="//s.yezgea02.com/1615974766264/gxqm.png" alt="" />}
        />
        <Cell
          hasArrow
          title="重制密码"
          onClick={() => history.push('/account')}
          icon={<img style={{width: 20, verticalAlign: '-7px'}} src="//s.yezgea02.com/1615974766264/zhaq.png" alt="" />}
        />
        <Cell
          hasArrow
          title="关于我们"
          onClick={() => history.push('/about')}
          icon={<img style={{width: 20, verticalAlign: '-7px'}} src="//s.yezgea02.com/1615975178434/lianxi.png" alt="" />}
        />
      </div>
      <Button className={Style.logout} block theme="danger" onClick={logout}>退出登录</Button>
    </div>
  )
}

export default User