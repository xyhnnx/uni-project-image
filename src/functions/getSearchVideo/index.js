const env = 'test-xyh'
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env
})
const db = cloud.database({
  env
})
const cheerio = require('cheerio');
const fetch = require('./fetch')
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

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    let {search} = event;
    const wxContext = cloud.getWXContext()
    let returnData;

    // 打开页面时间
    const startTime = new Date();
    // 渲染URL
    const url = 'http://100.xiaobeidy.com';
    try {
      // 使用request.js库发送get请求
      // const html = await http(url)
      const html = await fetch({
        url,
        params: {
          s: search
        },
        method: 'get',
        timeout: 120000,
      })
      // 载入并初始化cheerio
      const $ = cheerio.load(html)
      // 取出目标节点，即带article-list-link css类的<a>
      const linksDom = $('.excerpt .focus')
      const fetchPages = []
      // // 遍历dom集数组
      linksDom.each((index, item) => {
        fetchPages.push(
            fetch({
              url: $(item).attr('href'),
              method: 'get',
              timeout: 600000,
            })
        )
      })
      console.log(`开始请求${fetchPages.length}个页面`)
      const pageDetailArr = await Promise.all(fetchPages)
      console.log(`请求${pageDetailArr.length}个页面结束`)
      const dataArr = pageDetailArr.map((html, index) => {
        try {
          console.log(`正在爬取第${index + 1}个页面数据`)
          const $ = cheerio.load(html)
          // 取出目标节点，即带article-list-link css类的<a>
          const $mainDom = $($('.content-wrap')[0])
          const webUrl = $mainDom.find('.article-title').find('a').attr('href')
          const title = $mainDom.find('.article-title').text()
          const time = $mainDom.find('.article-meta .item').text().slice(0, 10)
          const imgSrc = $mainDom.find('.article-content img').eq(1).attr('src')
          const resource = []
          $($mainDom.find('.article-content').html().split('<hr>')[1]).find('a').each((index, item) => {
            resource.push({
              src: $(item).attr('href'),
              text: $(item).parent().text()
            })
          });

          return {
            webUrl,
            title,
            time,
            imgSrc,
            resource
          }
        } catch (e) {
          console.log(`爬取第${index + 1}个页面出错`)
          return false
        }
      })
      returnData = dataArr.filter(e => !!e)
    } catch (err) {
      console.log(`page发生错误：${url}`);
    }
    console.log(`页面耗时: ${new Date() - startTime}ms，渲染页URL：${url}`);

    return {
      data: returnData,
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
