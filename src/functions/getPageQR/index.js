
const env = 'test-xyh'
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env
})
const db = cloud.database({
  env
})

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let {path = 'page/index/index'} = event;
  try {
    const result = await cloud.openapi.wxacode.createQRCode({
      path,
      width: 430
    })
    // 添加到分类
    return {
      status: 0,
      data: result,
      message: '成功'
    }
  } catch (err) {
    return {
      status: 1,
      data: err,
      message: '失败'
    }
  }

}
