/**
 * Created by xyh on 2018/3/21.
 */
import {request} from './fetch.js'

// 获取token
export function getBaidubceToken (data = {}) {
  return request({
    url: 'https://aip.baidubce.com/oauth/2.0/token',
    data,
    method: 'get'
  })
}
// 通用文字识别（高精度含位置版） https://ai.baidu.com/ai-doc/OCR/tk3h7y2aq
export function getOcrAccurate (data = {},params = {}) {
  return request({
    url: 'https://aip.baidubce.com/rest/2.0/ocr/v1/accurate',
    data,
    params,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'post'
  })
}

export function getBingImg (data = {}) {
  let preFix = 'https://cn.bing.com'
  return request({
    url: `${preFix}/HPImageArchive.aspx?format=js&n=1&pid=hp&FORM=BEHPTB`,
    data,
    method: 'get'
  })
}
export function getKaiYanTagList (data = {}) {
  let preFix = 'https://baobab.kaiyanapp.com'
  return request({
    url: `${preFix}/api/v1/wallpapers/categories`,
    data,
    method: 'get'
  })
}

export function getKaiYanTagItemList (data = {}) {
  let preFix = 'https://baobab.kaiyanapp.com'
  let url = data.nextPageUrl || `${preFix}/api/v1/wallpapers/category?categoryId=${data.categoryId}`
  return request({
    url,
    method: 'get'
  })
}