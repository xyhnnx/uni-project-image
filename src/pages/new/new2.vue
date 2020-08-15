<template>
	<view class="new-page">
		<view class="head-area">
			<view class="name">必应壁纸</view>
			<view class="tip">选自于微软必应高清壁纸，每日更新</view>
			<view class="count">- 共{{totalDataList.length}}张 -</view>
		</view>
		<view class="first-image-box">
			<view class="new">今日最新</view>
			<image  @click="goDetail(0)" class="first-image"
					:src="dataList && dataList[0] && dataList[0].src"
					mode="widthFix">
			</image>
		</view>
		<view class="copyright">{{dataList && dataList[0] && dataList[0].copyright}}</view>
		<view class="list-box">
			<view v-for="(item, index) in dataList"
				  v-if="index>0"
				  @click="goDetail(index)"
				  :key="item.src + index"
				  class="list-item">
					<image class="img" :src="item.src" mode="aspectFill"></image>
			</view>
		</view>
		<text v-if="loadMoreText" class="loadMore">{{loadMoreText}}</text>
	</view>
</template>

<script>
	import * as api from '../../api/api'
	import * as util from '../../common/util'
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				totalDataList: [],
				showCount: 12,
				newImageSrc: '',
				loadMoreText: ''
			}
		},
		computed: {
			dataList () {
				return this.totalDataList.filter((e , i) => i < this.showCount)
			}
		},
		onReachBottom() {
			console.log('滑动到页面底部')
			if (this.dataList.length >= this.totalDataList.length) {
				this.loadMoreText = '没有更多了'
				return;
			}
			this.getData();
		},
		// onPullDownRefresh() {
		// 	console.log('下拉刷新');
		// 	this.refreshing = true;
		// 	this.fetchPageNum = 0;
		// 	this.getData();
		// },

		methods: {
			...mapMutations(['getUserInfo','setStateData']),
			getTotalListData () {
				// 浏览器
				// 渲染URL
				const prefix = `https://6d65-me-oacid-1300610701.tcb.qcloud.la`;
				let stop = false;
				let nowTime = new Date().getTime();
				let arr = []
				while (!stop) {
					nowTime = nowTime - (24 * 60 * 60 * 1000)
					let timeStr = util.dateFormat(nowTime, 'yyyyMMdd')
					let url = `${prefix}/BING/${timeStr}.jpg`
					if(['20200809','20200609','20200604','20200610','20200417'].includes(timeStr)) {
					} else {
						arr.push({
							src: url,
							label: timeStr
						})
					}
					if (nowTime <= new Date('2019-01-01').getTime()) {
						stop = true
					}
				}
				return arr
			},
			async getBingImg () {
				let res = await api.getBingImg({
					idx: 0,
					nc: new Date().getTime()
				})
				if(res && res.images && res.images[0]) {
					let preFix = 'https://cn.bing.com'
					this.setStateData({
						shareImgUrl: `${preFix}${res.images[0].url}`
					})
					this.totalDataList.unshift({
						copyright: res.images[0].copyright,
						src: `${preFix}${res.images[0].url}`,
					})
				}
			},
			async getData() {
				this.showCount += 12
			},
			goDetail(index) {
				console.log(index)
				uni.previewImage({
					current: this.totalDataList[index].src,
					urls: this.totalDataList.map(e => e.src)
				})
			},
			share(e) {
			}
		},
		// 加了这个页面才可以被分享
		onShareAppMessage () {
		},
		onLoad() {
			this.totalDataList = this.getTotalListData()
			this.getBingImg()
		},
	}
</script>

<style scoped lang="stylus">
@import "../../uni.styl"
.new-page
	display block
	width 100%
.copyright
	width 100%
	box-sizing border-box
	display flex
	font-size 10px
	padding 5px 5px 20px
.head-area
	padding-top: 70px;
	display flex
	flex-direction column
	align-items center
	width 100%
	color white
	background-color $uni-color-primary
	padding-bottom 10px
	.name
		font-weight bold
		font-size 30px
		line-height 50px
	.tip
		font-size 14px
		line-height 20px
	.count
		font-size 12px
		line-height 20px
.first-image-box
	display flex
	width 100%
	position relative
	.first-image
		width 100%
		box-sizing border-box
		padding 0 1px
	.new
		position absolute
		right 0
		top 0
		font-size 12px
		padding 10px 15px 0 0
		color #fff
		font-weight bold
.list-box
	width 100%
	display flex
	flex-wrap wrap
	box-sizing border-box
	padding 1px
	.list-item
		width 100%
		.img
			box-sizing border-box
			width 100%
			padding 0 1px 1px 0
			display block

</style>
