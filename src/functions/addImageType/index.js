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
  let list = event.imageTypeList;
  console.log('list==', list);
  if (list &&list.length) {
    await db.collection('imagetypes').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        ...list[0],
        createTime: new Date(),
        location: new db.Geo.Point(113, 23),
      }
    })
    .then(res => {
      console.log(res)
    })
    .catch(console.error)
    let listData = await db.collection('imagetypes').get();
    return {
      status: 0,
      data: listData,
      message: '成功'
    }
  }

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}
