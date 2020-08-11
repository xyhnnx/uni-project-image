<template>
	<view class="page-view">

		<view>
			<form @submit="checkText" :report-submit="true">
				<view class="padding10">
					<view class="label-view">
						<text class="label">文字 </text>
					</view>
					<input class="input" type="text" placeholder="请输入文字check" name="checkValue" />
				</view>
				<view class="button-view">
					<button type="default" class="login" hover-class="hover" formType="submit">checkText</button>
					<view class="height10"></view>
					<button type="default" class="login" hover-class="hover" @click="addData">add</button>
					<button type="default" class="login" hover-class="hover" @click="getSearchImg">getSearchImg</button>
					<button type="default" class="login" hover-class="hover" @click="puppeteer">puppeteer</button>
					<button type="default" class="login" hover-class="hover" @click="getBingImg">interval</button>
				</view>
			</form>
		</view>
		<view class="height10"></view>
		<form @submit="messageSend" :report-submit="true">
			<button type="default" class="login" hover-class="hover" formType="submit">消息通知</button>
		</form>
	</view>
</template>

<script>
	import * as util from '../../common/util'
	export default {
		data() {
			return {};
		},
		methods: {
			messageSend(e) {
				console.log(e)
				let formId = e.detail.formId;
				wx.cloud.init()                              //调用前需先调用init
				wx.cloud.callFunction({
					name: 'sendMessage',
					data: {
						formId
					}
				}).then(res => {
					console.log('res',res)
					uni.showToast(
							{
								title: res.result.errMsg,
								icon: 'none',
							}
					);
				})
			},
			checkText(e) {
				console.log(e)
				let text = e.detail.value.checkValue
				console.log("文字:"+ text)
				wx.cloud.init()                              //调用前需先调用init
				wx.cloud.callFunction({
					name: 'check',
					data: {
						"content": text
					}
				}).then(res => {
					console.log('res',res)
					uni.showToast(
							{
								title: res.result.msg,
								icon: 'none',
							}
					);
				})
			},
			addData () {
				wx.cloud.init()                              //调用前需先调用init
				wx.cloud.callFunction({
					name: 'addImageType',
					data: {
						imageTypeList: [
							{
								"name": 'test-xyh'
							}
						]
					}
				}).then(res => {
					console.log('res',res)
					uni.showToast(
							{
								title: res.result.msg,
								icon: 'none',
							}
					);
				})
			},
			getSearchImg () {
				wx.cloud.init()                              //调用前需先调用init
				wx.cloud.callFunction({
					name: 'getSearchImg',
					data: {
						search: '美女'
					}
				}).then(res => {
					console.log('res',res)
					uni.showToast(
							{
								title: res.result.msg,
								icon: 'none',
							}
					);
				})

			},
			puppeteer () {
				wx.cloud.init()                              //调用前需先调用init
				wx.cloud.callFunction({
					name: 'puppeteerUtil',
					data: {
						search: '美女'
					}
				}).then(res => {
					console.log('res',res)
					uni.showToast(
							{
								title: res.result.msg,
								icon: 'none',
							}
					);
				})

			},
			// 获取必应图片保存到数据库
			async getBingImg () {
				let res2 = await wx.cloud.callFunction({
					name: 'interval'
				})
				console.log(res2)
			},
			// 添加数据到commonImageList 只能调用一次
			async addImg () {
				// 浏览器
				// 渲染URL
				const prefix = `https://6d65-me-oacid-1300610701.tcb.qcloud.la`;
				let stop = false;
				let nowTime = new Date().getTime();
				let arr = []
				while (!stop) {
					let timeStr = util.dateFormat(nowTime, 'yyyyMMdd')
					let url = `${prefix}/BING/${timeStr}.jpg`
					arr.push({
						src: url,
						createTime:  new Date(nowTime)
					})
					nowTime = nowTime - (24 * 60 * 60 * 1000)
					if (nowTime <= new Date('2019-01-01').getTime()) {
						stop = true
					}
				}
				console.log(arr)
				const db = wx.cloud.database()
				console.log(db)
				arr.forEach((e, i) => {

				})
				for(let i = 0;i<arr.length;i++) {
					let e = arr[i]
					let res = await db.collection('commonImageList').add({
						// data 字段表示需新增的 JSON 数据
						data: {
							...e,
						}
					})
					console.log(`第${i}条数据`)
				}

			},
		},
		onLoad() {
			console.log('load---')
		}
	}
</script>

<style scoped>
.page-view{
	display: flex;
	flex-direction: column;
}
.height10{
	height: 10px;
}
.padding10{
	padding: 10px;
}
</style>
