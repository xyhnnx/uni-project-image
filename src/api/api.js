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
