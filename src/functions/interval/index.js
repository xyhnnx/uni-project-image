
const env = 'test-xyh'
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env
})
const db = cloud.database({
  env
})
const fetch = require('./fetch')
async function getBingImg(params = {}) {
  return fetch({
    url: 'https://api.66mz8.com/api/bing.php?format=json',
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
  while (!stop) {
    let res = await getBingImg({
      idx: idx
    })
    idx ++
    if(res.code === 200) {
      try {
        let res2 = await cloud.callFunction({
          name: 'addDataToCould',
          data: {
            dbName: 'commonImageList',
            primaryKey: 'src',
            list: [
              {
                src: res.img_url,
                title:res.img_copr
              }
            ]
          }
        })
        console.log(res2)
      }catch (e) {
        stop = true
      }
    } else {
      stop = true
    }
    if(idx >=20) {
      stop = true
    }
  }
}
// 云函数入口函数
exports.main = async (event, context) => {
  getImg()
  return {}
}
