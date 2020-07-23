const env = 'test-xyh'
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env
})
const db = cloud.database({
  env
})
// 浏览器连接工具
const BrowserUtil = require('./browser');
const getPageImages = async () => {
  let returnData;
  // 浏览器
  let browser;
  try {
    // 重新连接至浏览器
    browser = await BrowserUtil.connect('page-image');
  } catch (err) {
    console.log(`连接至浏览器报错: ${JSON.stringify(err)}`);
    try {
      console.log('重启浏览器成功');
      await BrowserUtil.init('wrongTopic');
      browser = await BrowserUtil.connect('page-image');
    } catch (err2) {
      const text = `重启浏览器失败，原因:${JSON.stringify(err2)}`;
      console.log(text);
    }
  }
  const page = await browser.newPage();

  // 打开页面时间
  const startTime = new Date();
  // 渲染URL
  let url = null;
  try {
    // 渲染页JS异常
    page.on('pageerror', async meg => {
      await page.close();
      console.log(meg);
    });
    // 渲染页console事件
    // page.on('console', (msg) => {
    //   msg.args().forEach(msgItem => {
    //     console.log(msgItem._remoteObject.value)
    //   })
    // })

    url = 'https://image.baidu.com/search/index?tn=baiduimage&ipn=r&ct=201326592&cl=2&lm=-1&st=-1&fr=&sf=1&fmq=1567133149621_R&pv=&ic=0&nc=1&z=0&hd=0&latest=0&copyright=0&se=1&showtab=0&fb=0&width=&height=&face=0&istype=2&ie=utf-8&sid=&word=%E5%A3%81%E7%BA%B8';
    console.log(`渲染URL：${url}`);
    // await page.setCookie({name: 'token', value: JSON.stringify(token), url: config.webUrl})
    // 可设置页面宽高大一些；就会多获取数据
    page.setViewport({width: 2000, height: 2000})
    await page.goto(url, { timeout: 60000, waitUntil: 'networkidle2' });
    returnData = await page.evaluate(() => {
      // eslint-disable-next-line no-undef
      const imgdom = Array.from(document.getElementsByTagName('img'));
      const arr = [];
      imgdom.forEach(e => {
        const src = e.getAttribute('src');
        if (src.startsWith('http')) {
          arr.push({
            src
          });
        }
      });
      return arr;
    });
    // 等待页面渲染完成 #render-finish
    // await page.waitForSelector('#renderFinish', {visible: true, timeout: data.timeout})
    // 生成pdf
    // await page.pdf()
    // 关闭页面
    await page.close();
    // 断开浏览器连接
    browser.disconnect();
  } catch (err) {
    console.log(`page发生错误：${url}`);
    // 关闭页面
    await page.close();
    // 断开浏览器连接
    browser.disconnect();
    // 抛出异常
    throw err;
  }
  console.log(`页面耗时: ${new Date() - startTime}ms，渲染页URL：${url}`);
  return {
    data: returnData
  }
}
// 云函数入口函数
exports.main = async (event, context) => {
  // const puppeteerFun = require('puppeteerFun')
  const wxContext = cloud.getWXContext()
  let list = await getPageImages()
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    list
  }
}
