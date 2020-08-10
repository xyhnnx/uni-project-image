
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
async function goWeb1(params = {}) {
  return fetch({
    url: `https://blog.csdn.net/weixin_42170906/article/details/107889923`,
    params,
    method: 'get',
    timeout: 60000
  })
}
async function goWeb2(params = {}) {
  return fetch({
    url: `https://blog.csdn.net/weixin_42170906/article/details/107907537`,
    params,
    method: 'get',
    timeout: 60000
  })
}
async function goWeb3(params = {}) {
  return fetch({
    url: `https://blog.csdn.net/weixin_42170906/article/details/80252152`,
    params,
    method: 'get',
    timeout: 60000
  })
}
// 云函数入口函数
exports.main = async (event, context) => {
  let success = true
  try {
    // 每6分钟执行一次
    await goWeb1()
    await goWeb2()
    await goWeb3()
  }catch (e) {
    success = false
  }
  return {success}
}
