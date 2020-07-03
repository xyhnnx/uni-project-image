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
  try{
    let {params,pageNo, pageSize,dbName} = event;
    let totalData = await db.collection(dbName).where({
      ...params
    }).count();

    let listData = await db.collection(dbName).where({
      ...params
    }).skip((pageNo - 1) * pageSize) // 跳过结果集中的前 10 条，从第 11 条开始返回
    .limit(pageSize) // 限制返回数量为 10 条
    .get();
    return {
      totalCount:totalData.total,
      status: 0,
      message: '成功',
      data: listData.data
    }
  }catch (e) {
    return {
      status: 1,
      message: '失败',
      data: e
    }
  }

}
