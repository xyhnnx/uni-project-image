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
// Baidu图片
async function getSearchImgBaidu(params = {}) {
  return fetch({
    url: 'https://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&ct=201326592&is=&fp=result&queryWord=%E7%BE%8E%E5%A5%B3&cl=2&lm=-1&ie=utf-8&oe=utf-8&adpicid=&st=-1&z=9&ic=0&hd=0&latest=0&copyright=0&s=&se=&tab=&width=0&height=0&face=0&istype=2&qc=&nc=1&fr=&expermode=&force=&gsm=1e&1595420111298=',
    params,
    method: 'get',
    timeout: 3000,
    // headers: {
    // }
  })
}
// 视觉中国图片
async function getSearchImgVcg(params = {}) {
  return fetch({
    url: 'https://www.vcg.com/api/common/searchAllImage',
    params,
    method: 'get',
    timeout: 3000,
    // headers: {
    // }
  })
}
// 获取配置
async function getConfig() {
  let resData = await cloud.callFunction({
    name: 'getDbListData',
    data: {
      dbName: 'config',
      pageNo: 1,
      pageSize: 1,
      limitType: 3
    }
  })
  return resData.result.data[0] || {};
}
// 获取图片
async function getSearchImgCommon(params = {}, ) {
  let {search,pageNo, pageSize} = params;
  const wxContext = cloud.getWXContext()
  const config = await getConfig()
  if(config.searchImageSource === 'vcg') {
    // 这个接口支持page（pageNO）参数，不支持pageSize；返回的list数量（pageSize）固定为140
    const result = await getSearchImgVcg({
      phrase: search,
      // page: pageNo
    })
    let arr = []
    let startNo = (pageNo-1) * pageSize
    result.list.slice(startNo, startNo + pageSize).forEach(async e => {
      if(e.equalh_url) {
        let item = {
          src: e.equalh_url,
          desc: e.caption,
          search,
          openId: wxContext.OPENID,
          lookCount: 0
        }
        arr.push(
            item
        )
      }
    })
    return arr
  } else { // Baidu
    const result = await getSearchImgBaidu({
      word: search,
      rn: pageSize, // pageSize
      pn: (pageNo-1) * pageSize// 第几个开始跳
    })
    let arr = []
    result.data.forEach(async e => {
      if(e.hoverURL) {
        let item = {
          src: e.hoverURL,
          desc: e.fromPageTitleEnc,
          search,
          openId: wxContext.OPENID,
          lookCount: 0
        }
        arr.push(
            item
        )
      }
    })
    return arr
  }
}
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    let {saveToHistory = true, search,pageNo, pageSize} = event;
    const wxContext = cloud.getWXContext()
    let arr = await getSearchImgCommon({
      search,
      pageNo,
      pageSize,
    })

    if(saveToHistory) { // 添加到搜索历史记录里面
      for(let i = 0;i<arr.length;i++) {
        let item = arr[i]
        item.openId = item.openId || wxContext.OPENID
        item.createTime = new Date()
        let countRes = await db.collection('userSearchImgHistory').where({
          src: item.src,
          openId: item.openId
        }).count();
        if(countRes.total === 0) {// 不存在则添加
          db.collection('userSearchImgHistory').add({
            // data 字段表示需新增的 JSON 数据
            data: {
              ...item,
            }
          })
        }
      }
    }

    return {
      data: arr,
      status: 0,
      message: '成功'
    }
  }catch (e) {
    return {
      data: e,
      status: 1,
      message: '失败'
    }
  }
}
