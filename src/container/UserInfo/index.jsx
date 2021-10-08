import React, { useEffect, useState } from 'react';
import { FilePicker, Button, Input, Toast } from 'zarm';
import { useHistory } from 'react-router-dom';
import Header from '@/components/Header' // 由于是内页，使用到公用头部
import axios from 'axios'; // // 由于采用 form-data 传递参数，所以直接只用 axios 进行请求
import { get, post, imgUrlTrans } from '@/utils'; 
import Style from './style.module.less'

const UserInfo = () => {
  const history = useHistory(); // 路由实例
  const [user, setUser] = useState({}); // 用户
  const [avatar, setAvatar] = useState(''); // 头像
  const [signature, setSignature] = useState(''); // 个签
  const token = localStorage.getItem('token'); // 登录令牌

  useEffect(() => {
    getUserInfo(); // 初始化请求
  }, []);

  // 获取用户信息
  const getUserInfo = async () => {
    const { data } = await get('/api/user/get_userinfo');
    setUser(data);
    setAvatar(imgUrlTrans(data.avatar))
    setSignature(data.signature)
  };

  // 获取图片回调 
  const handleSelect = (file) => {
    console.log('file', file.file)
    if (file && file.file.size > 200 * 1024) {
      Toast.show('上传头像不得超过 200 KB！！')
      return
    }
    let formData = new FormData()
     // 生成 form-data 数据类型
    formData.append('file', file.file)
    // 通过 axios 设置  'Content-Type': 'multipart/form-data', 进行文件上传
    axios({
      method: 'post',
      url: `/api/upload`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': token
      }
    }).then((res) => {
      console.log(res)
      // 返回图片地址
      setAvatar(imgUrlTrans(res.data))
    })
  }

  // 编辑用户信息方法
  const save = async () => {
    const { data } = await post('/api/user/edit_userinfo', {
      signature,
      avatar
    })

    Toast.show('修改成功')
    // 成功后回到个人中心页面
    history.goBack()
  }

  return (
    // <></> 等同于 <React.Fragment></React.Fragment>
    <> 
      <Header title="用户信息" />
      <div className={Style.userinfo}>
        <h1>个人资料</h1>
        <div className={Style.item}>
          <div className={Style.title}>头像</div>
          <div className={Style.avatar}>
            <img className={Style.avatarUrl} src={avatar} alt=""/>
            <div className={Style.desc}>
              <span>支持 jpg、png、jpeg 格式大小 200KB 以内的图片</span>
              <FilePicker className={Style.filePicker} onChange={handleSelect} accept="image/*">
                <Button className={Style.upload} theme='primary' size='xs'>点击上传</Button>
              </FilePicker>
            </div>
          </div>
        </div>
        <div className={Style.item}>
          <div className={Style.title}>个性签名</div>
          <div className={Style.signature}>
            <Input 
              clearable
              type="text"
              value={signature}
              placeholder="请输入个性签名"
              onChange={(value) => setSignature(value)}
            />
          </div>
        </div>
        <Button onClick={save} style={{marginTop: 50}} block theme="primary">保存</Button>
      </div>
    </>
  )
}

export default UserInfo