const env = 'test-xyh'
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env
})
const db = cloud.database({
  env
})

// 云函数入口函数 142xyh753869
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let powRes = await cloud.callFunction({
    name: 'getUserPower',
    data: {
      openId: wxContext.OPENID
    }
  })
  let isAdmin = powRes && powRes.result === -1
  const $ = db.command.aggregate
  let res =  await db.collection('userImageList').aggregate()
  .group({
    _id: '$openId',
    num: $.sum(1)
  })
  .end()
  console.log(res)
  let list = []
  // 再每组取一条数据
  if(res && res.list && res.list.length) {
    res.list = res.list.filter(item => {
      // 我的openId
      if(isAdmin) {
        return true
      } else {
        return wxContext.OPENID === item._id
      }
    })
    for(let i = 0;i< res.list.length;i++) {
      let item = res.list[i]
      let res2 = await db.collection('userImageList').where({
        openId: item._id
      }).limit(1).get()
      let data = res2.data[0]
      list.push(data)
    }
  }
  // 添加到分类
  return {
    status: 0,
    data: list,
    message: '成功'
  }

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}
