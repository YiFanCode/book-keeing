import React from 'react'
import Header from '@/components/Header'

import Style from './style.module.less'

const About = () => {
  return <>
    <Header title='关于我们' />
    <div className={Style.about}>
      <h2>关于项目</h2>
      <article>本项目的服务端采用 Node 上层架构 Egg.js，前端采用 React 框架 + Zarm 移动端组件库。从设计数据库到接口的编写，前端的接口数据对接和页面制作，再到线上环境的部署。</article>
    </div>
  </>
};

export default About;