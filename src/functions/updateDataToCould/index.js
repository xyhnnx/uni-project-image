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
  let updateRes = []
  // 数据库名称 数据库唯一标识（用于添加时判断是否存在） 要插入的数据List
  let {dbName, primaryKey, list, data = {}} = event;
  console.log(dbName, primaryKey, list, data)
  if (list &&list.length) {
    for(let i = 0;i<list.length;i++) {
      // 查询该条记录是否存在
      let item = list[i];
      let res = await db.collection(dbName).where({
        [primaryKey]: item[primaryKey]
      }).update({
        data
      });
      updateRes.push(res)
    }
  }

  return {
    status: 0,
    data: updateRes,
    message: '成功'
  }

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}
