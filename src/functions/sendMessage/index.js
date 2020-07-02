const env = 'test-xyh'
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env
})
const db = cloud.database({
  env
})


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    const result = await cloud.openapi.uniformMessage.send({
      touser: wxContext.OPENID,
      weappTemplateMsg: {
        page: 'pages/tag/tag',
        data: {
          keyword1: {
            value: 'test1'
          },
          keyword2: {
            value: 'test2'
          },
          keyword3: {
            value: 'test3'
          },
          keyword4: {
            value: 'test4'
          }
        },
        templateId: 'QTFRsFomNJIP1rC49d_HmEX2khcGknGGxj41EtA5FL4',
        formId: event.formId,
        emphasisKeyword: 'keyword1.DATA'
      }
    })
    return result
  } catch (err) {
    return err
  }


  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}
