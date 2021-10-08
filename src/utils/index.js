import axios from './axios'
import { baseUrl } from 'config'

const MODE = import.meta.env.MODE // 环境变量
export const imgUrlTrans = (url) => {
  if (url && url.startsWith('http')) {
    return url
  } else {
    url = `${MODE == 'development' ? baseUrl : 'http://api.chennick.wang'}${url}`
    return url
  }
}

export const typeMap = {
  1: {
    icon: 'icon-canyin'
  },
  2: {
    icon: 'icon-fushi'
  },
  3: {
    icon: 'icon-gongjiaoche'
  },
  4: {
    icon: 'icon-fangzi'
  },
  5: {
    icon: 'icon-gouwuche'
  },
  6: {
    icon: 'icon-xuewei'
  },
  7: {
    icon: 'icon-yiliao'
  },
  8: {
    icon: 'icon-lvyou'
  },
  9: {
    icon: 'icon-renqing'
  },
  10: {
    icon: 'icon-qita'
  },
  11: {
    icon: 'icon-gongzi'
  },
  12: {
    icon: 'icon-jiangjin'
  },
  13: {
    icon: 'icon-zhuanzhang'
  },
  14: {
    icon: 'icon-licai'
  },
  15: {
    icon: 'icon-tuikuan'
  },
  16: {
    icon: 'icon-qita'
  }
}

export const REFRESH_STATE = {
  normal: 0, // 普通
  pull: 1, // 下拉刷新（未满足刷新条件）
  drop: 2, // 释放立即刷新（满足刷新条件）
  loading: 3, // 加载中
  success: 4, // 加载成功
  failure: 5, // 加载失败
}

export const LOAD_STATE = {
  normal: 0, // 普通
  abort: 1, // 中止
  loading: 2, // 加载中
  success: 3, // 加载成功
  failure: 4, // 加载失败
  complete: 5, // 加载完成（无新数据）
}

export const get = axios.get

export const post = axios.post