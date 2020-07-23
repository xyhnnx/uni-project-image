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
async function getSearchImg(params = {}) {
  return fetch({
    url: 'https://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&ct=201326592&is=&fp=result&queryWord=%E7%BE%8E%E5%A5%B3&cl=2&lm=-1&ie=utf-8&oe=utf-8&adpicid=&st=-1&z=9&ic=0&hd=0&latest=0&copyright=0&s=&se=&tab=&width=0&height=0&face=0&istype=2&qc=&nc=1&fr=&expermode=&force=&gsm=1e&1595420111298=',
    params,
    method: 'get',
    timeout: 3000,
    // headers: {
    // }
  })
}
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    let {saveToHistory = true, search,pageNo, pageSize} = event;
    const wxContext = cloud.getWXContext()
    // // 示例：请求一个 npm 模块信息
    const result = await getSearchImg({
      word: search,
      rn: pageSize, // pageSize
      pn: (pageNo-1) * pageSize// 第几个开始跳
    })
    let arr = []
    result.data.forEach(e => {
      if(e.hoverURL) {
        arr.push(
          {
            src: e.hoverURL,
            desc: e.fromPageTitleEnc,
            search,
            openId: wxContext.OPENID,
            lookCount: 0
          }
        )
      }
    })
    // 保持到搜索歷史
    if(saveToHistory) {
      cloud.callFunction({
        // 需调用的云函数名
        name: 'addDataToCould',
        // 传给云函数的参数
        data: {
          dbName: 'userSearchImgHistory',
          primaryKey: 'src',
          list:arr
        },
        // 成功回调
        complete: console.log
      })
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
