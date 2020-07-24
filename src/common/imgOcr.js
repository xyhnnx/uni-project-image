import {getBaidubceToken, getOcrAccurate } from "../api/api"

const ocrAccurate = async (base64) => {
  let res = await getBaidubceToken({
    'grant_type': 'client_credentials',
    'client_id': 'hxau6TXH6itRSEyCGRls8gGC', // 百度智能云账号获取 https://console.bce.baidu.com/ai/?_=1595600838454&fromai=1#/ai/ocr/app/list
    'client_secret': 'lQ3bXiS6t185PcroeCoGlHr5Blofk64O'
  })
  let access_token = res.access_token
  let res2 = await getOcrAccurate({
    image: base64,
  },{
    access_token
  })
  return res2
}
module.exports = {
  ocrAccurate
};
