
const env = 'test-xyh'
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env
})
const db = cloud.database({
  env
})
let preFix = 'https://cn.bing.com'
const fetch = require('./fetch')
async function getBingImg(params = {}) {
  return fetch({
    url: `${preFix}/HPImageArchive.aspx?format=js&n=1&pid=hp&FORM=BEHPTB`,
    params,
    method: 'get',
    timeout: 3000,
    // headers: {
    // }
  })
}
async function goWebCSDN(params = {}) {
  return fetch({
    url: `https://blog.csdn.net/weixin_42170906/article/details/107889923`,
    params,
    method: 'get',
    timeout: 3000,
    // headers: {
    // }
  })
}
async function getImg(params = {}) {
  const wxContext = cloud.getWXContext()
  let stop = false
  let idx = 0
  let count = 0
  while (!stop) {
    let res = await getBingImg({
      idx: idx,
      nc: new Date().getTime()
    })
    idx ++
    console.log(res,idx)
    if(res && res.images && res.images.length) {
      try {
        let data = res.images[0]
        let res2 = await cloud.callFunction({
          name: 'addDataToCould',
          data: {
            dbName: 'commonImageList',
            primaryKey: 'src',
            // url 字段里的‘1920x1080’替换未‘UHD’然后把.jpg 后的参数 去掉；可以得到更高清的图片
            list: [
              {
                src: `${preFix}${data.url}`,
                title: data.copyright
              }
            ]
          }
        })
        count += res2.result.data.addCount
        console.log(res2)
      }catch (e) {
        stop = true
      }
    } else {
      stop = true
    }
    if(idx >=10) {
      stop = true
    }
  }
  return count
}
// 云函数入口函数
exports.main = async (event, context) => {
  goWebCSDN()
  let count = await getImg()
  return {count}
}
