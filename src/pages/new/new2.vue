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
		<ad-custom v-if="config && config.showAd" unit-id="adunit-dbe74d485767b19f"></ad-custom>
		<view class="list-box">
			<view v-for="(value, index) in dataList"
				  v-if="index>0"
				  @click="goDetail(index)"
				  :key="value.src + index"
				  class="list-item">
					<image class="img" :src="value.src" :data-src="value.src"  @error="imgError" mode="aspectFill"></image>
					<view class="copyright" v-if="value.copyright">{{value.copyright}}</view>
					<ad-custom v-if="index % 15 === 0 && config && config.showAd" unit-id="adunit-3ccae9420de91cc3"></ad-custom>
					<ad-custom v-else-if="index % 10 === 0 && config && config.showAd" unit-id="adunit-d213c6836dda2ce5"></ad-custom>
					<ad v-else-if="index % 5 === 0 && config && config.showAd" unit-id="adunit-768b4c9a310a7c9c" ad-type="video" ad-theme="black"></ad>
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
			... mapState(['userInfo','config', 'userPower', 'shareImgUrl']),
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
				const prefix = `http://cdn.mrabit.com`;
				let stop = false;
				let nowTime = new Date().getTime() - (8 * 24 * 60 * 60 * 1000);
				let arr = []
				while (!stop) {
					nowTime = nowTime - (24 * 60 * 60 * 1000)
					let timeStr = util.dateFormat(nowTime, 'yyyy-MM-dd')
					let url = `${prefix}/1920.${timeStr}.jpg`
					arr.push({
						src: url,
						label: timeStr
					})
					if (nowTime <= new Date('2017-01-01').getTime()) {
						stop = true
					}
				}
				return arr
			},
			async getBingImg () {
				let res = await api.getBingImg({
					idx: 0,
					n: 8,
					nc: new Date().getTime()
				})
				if(res && res.images && res.images[0]) {
					let preFix = 'https://cn.bing.com'
					this.setStateData({
						shareImgUrl: `${preFix}${res.images[0].url}`
					})
					this.totalDataList.unshift(...res.images.map(e =>{
						return {
							copyright: e.copyright,
							src: `${preFix}${e.url}`,
						}
					}))
				}
			},
			async getData() {
				this.showCount += 12
			},
			goDetail(index) {
				uni.previewImage({
					current: this.totalDataList[index].src,
					urls: this.totalDataList.map(e => e.src)
				})
			},
			share(e) {
			},
			imgError (value) {
				let src = value.currentTarget.dataset.src
				let index = this.totalDataList.findIndex(e => e.src === src)
				this.totalDataList.splice(index,1)
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
		padding 0
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
	padding 0
	.list-item
		display block
		width 100%
		.img
			box-sizing border-box
			width 100%
			padding 0
			display block

</style>
