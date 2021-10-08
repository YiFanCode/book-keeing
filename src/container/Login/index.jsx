import React, { useCallback, useRef, useState, useEffect } from 'react'
import { Cell, Input, Button, Checkbox, Toast } from 'zarm'
import cx from 'classnames'
import Captcha from "react-captcha-code" // 随机验证码
import CustomIcon from '@/components/CustomIcon'
import Style from './style.module.less'
import { post } from '@/utils'

const Login = () => {
  const captchaRef = useRef()
  const [type, setType] = useState('login') // 登录注册类型
  const [username, setUsername] = useState(''); // 账号
  const [password, setPassword] = useState(''); // 密码
  const [verify, setVerify] = useState(''); // 验证码
  const [captcha, setCaptcha] = useState(''); // 验证码变化后存储值
  const [agree, setAgree] = useState(false) // 同意协议

  // 验证码变化，回调方法。 初始化执行一次， 当captch发生变化时再执行一次
  const handleChange = useCallback((captcha) => {
    console.log('captcha', captcha)
    setCaptcha(captcha)
  }, [])
  // 注册协议
  const handleAgree = () => {
    setAgree(!agree)
  }

  const onSubmit = async () => {
    if (!username) {
      Toast.show('请输入账号')
      return
    }
    if (!password) {
      Toast.show('请输入密码')
      return
    }

    try {
      // 判断是否是登录状态
      if (type == 'login') {
        // 执行登录接口，获取 token
        const { data } = await post('/api/user/login', {
          username,
          password
        })
        console.log('data',data)
        // 登录成功后将 token 写入 localStorage
        localStorage.setItem('token', data.token)
        window.location.href = '/'// 跳转到首页
      } else {
        if (!verify) {
          Toast.show('请输入验证码')
          return
        }
        if (verify != captcha) {
          Toast.show('验证码错误')
          return
        }
        if (!agree) {
          Toast.show('请勾选同意协议')
          return
        }

        const { data } = await post('user/register', {
          username,
          password
        });
        Toast.show('注册成功');
        // 注册成功，自动将 tab 切换到 login 状态
        setType('login')
      }
    } catch (error) {
      console.log(error)
      Toast.show(error.msg || '网络错误');
    }
  }

  useEffect(() => {
    document.title = type == 'login' ? '登录' : '注册'
  }, [type])

  return (
    <div className={Style.auth}>
      <div className={Style.head}></div>
      <div className={Style.tab}>
        <span className={cx({[Style.active]: type == 'login'})} onClick={() => setType('login')}>登录</span>
        <span className={cx({[Style.active]: type == 'register'})} onClick={() => setType('register')}>注册</span>
      </div>
      <div className={Style.form}>
        <Cell icon={<CustomIcon type="icon-zhanghao"/>}>
          <Input clearable type="text" placeholder="请输入账号" onChange={(value) => setUsername(value)} />
        </Cell>
        <Cell icon={<CustomIcon type="icon-mima" />}>
          <Input clearable type="password" placeholder="请输入密码" onChange={(value) => setPassword(value)} />
        </Cell>
        {
          type == 'register' ? <Cell icon={<CustomIcon type="icon-mima" />}>
            <Input 
              clearable 
              type="password" 
              placeholder="请输入验证码" 
              onChange={(value) => setVerify(value)} 
            />
            <Captcha ref={captchaRef} charNum={4} onChange={handleChange} />
          </Cell> : null
        }
      </div>
      <div className={Style.operation}>
        {
          type == 'register' ? <div className={Style.agree}>
            <Checkbox checked={agree} id="agreement" onChange={handleAgree} />
            <label htmlFor="agreement" className="text-light">
              阅读并同意<a href="/#"
              onClick={(e) => { e.preventDefault(); alert('agree it'); }}>《掘掘手札条款》</a>
            </label>
          </div> : null
        }
        <Button block theme="primary" onClick={onSubmit}>{type == 'login' ? '登录': '注册'}</Button>
      </div>
    </div>
  )
}

export default Login