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
    let {params = {},orderName,orderType = 'desc',pageNo, pageSize,dbName,limitType = 2, isUserInfo} = event;
    // limitType 1 只看到自己 2 普通看到自己；超管看所有 3 都看到所有
    if(limitType === 2) {
      let powRes = await cloud.callFunction({
        name: 'getUserPower',
        data: {
          openId: wxContext.OPENID
        }
      })
      let isAdmin = powRes && powRes.result === -1
      if(!isAdmin) { // 如果不是超管，则只看到自己的，（超管看到所有）
        params.openId = wxContext.OPENID
      }
    } else if(limitType === 1) {
      params.openId = wxContext.OPENID
    } else if(limitType === 3) {

    }
    // 获取总数
    let totalData = await db.collection(dbName).where({
      ...params
    }).count();

    let listData = await (async ()=>{
      let data;
      let dbObj = await db.collection(dbName).where({
        ...params
      })
      if(orderName) { // 如果需要排序 asc 或 desc
        dbObj = await dbObj.orderBy(orderName,orderType)
      }
      dbObj = await dbObj.skip((pageNo - 1) * pageSize) // 跳过结果集中的前 10 条，从第 11 条开始返回
      .limit(pageSize) // 限制返回数量为 10 条
      .get();
      data = dbObj
      return data;
    })()
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
