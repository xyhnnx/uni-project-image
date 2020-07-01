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
  console.log(dbName, primaryKey, list)
  if (list &&list.length) {
    for(let i = 0;i<list.length;i++) {
      // 查询该条记录是否存在
      let item = list[i];
      let countRes = await db.collection(dbName).where({
        [primaryKey]: item[primaryKey]
      }).count();
      if(countRes.total === 0) {// 不存在则添加
        await db.collection(dbName).add({
          // data 字段表示需新增的 JSON 数据
          data: {
            ...item,
            createTime: new Date(),
            location: new db.Geo.Point(113, 23),
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
