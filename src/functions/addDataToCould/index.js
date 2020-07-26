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
  let addCount = 0
  // 数据库名称 数据库唯一标识（用于添加时判断是否存在） 要插入的数据List
  let {dbName, primaryKey, list} = event;
  if (list &&list.length) {
    for(let i = 0;i<list.length;i++) {
      // 查询该条记录是否存在
      let item = list[i];
      item.openId = item.openId || wxContext.OPENID
      item.createTime = new Date()
      item.location = new db.Geo.Point(113, 23)
      let countRes
      if (primaryKey) { // 如果传来primaryKey；则先判断是否存在；不存在才添加
        countRes = await db.collection(dbName).where({
          [primaryKey]: item[primaryKey]
        }).count();
      } else { // 直接判定不存在
        countRes = {
          total: 0
        }
      }

      if(countRes.total === 0) {// 不存在则添加
        await db.collection(dbName).add({
          // data 字段表示需新增的 JSON 数据
          data: {
            ...item,
          }
        })
        addCount ++
      }
    }
  }

  return {
    status: 0,
    data: {
      addCount
    },
    message: '成功'
  }

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}
