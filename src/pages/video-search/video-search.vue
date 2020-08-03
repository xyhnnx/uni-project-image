<template>
	<view class="wrap">
		<view class="search-box">
			<SearchBtn placeholder="请输入关键字搜索" v-model="search" @searchClick="searchClick"></SearchBtn>
		</view>
		<view class="list" v-if="list && list.length">
			<view class="item" v-for="item in list" :key="item.webUrl">
				<view class="content">
					<image mode="widthFix" class="image" :src="item.imgSrc"></image>
					<view class="des">
						<view class="title">{{item.title}}</view>
						<view class="time">{{item.time}}</view>
					</view>
				</view>
				<view class="res-list">
					<view class="res-list-item" v-for="resItem in item.resource" :key="resItem.src">
						<view @click="copy(resItem)">{{resItem.src}}</view>
						<view @click="copy(resItem)">{{resItem.text}}</view>
					</view>
				</view>
			</view>
		</view>
		<view v-else class="center">
			暂无数据
		</view>
	</view>
</template>

<script>
	import SearchBtn from '../components/search-btn'

	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				search: '',
				list: []
			};
		},
		components: {SearchBtn},
        computed: mapState(['userInfo']),
		methods: {
			...mapMutations(['getUserInfo','setStateData']),
			async searchClick () {
				uni.showLoading({
					title: '加载中...'
				})
				let res
				try {
					res = await wx.cloud.callFunction({
						name: 'getSearchVideo',
						data: {
							search: this.search || '肖申克'
						}
					})
					uni.hideLoading()
				} catch (e) {
					uni.hideLoading()
					uni.showToast(
							{
								title: '搜索失败，请修改关键字重试',
								icon: 'none',
							}
					);
				}
				if(res.errMsg === 'cloud.callFunction:ok' && res.result.status === 0) {
					console.log('res',res)
					this.list = res.result.data
				} else {
					uni.showToast(
							{
								title: res.result.msg,
								icon: 'none',
							}
					);
				}
			},
			copy (item) {
				console.log(item)
				let text = `${item.src}\n${item.text}`
				wx.setClipboardData({
					data: text,
					success (res) {
						wx.getClipboardData({
							success (res) {
								console.log(res.data) // data
							}
						})
					}
				})
			}
		},
		async onLoad() {
		}
	}
</script>

<style lang="stylus" scoped>
.wrap
	display block
	width 100%
.search-box
	box-sizing border-box
	display block
	width 100%
	padding 10px
	background-color #fff;

.list
	display flex
	flex-direction column
	.item
		margin 10px 5px
		padding 10px
		border-radius 5px
		background-color #fff
		display flex
		flex-direction column
		.content
			display flex
			.image
				width 100px
				margin-right 10px
			.des
				flex 1
				display flex
				flex-direction column
				.title
					font-size 16px
				.time
					margin-top 10px
					font-size 12px
		.res-list
			display block
			.res-list-item
				margin 5px 0
				display block
				view
					word-break break-all


.center
	text-align center
	margin 20px
	color #999
</style>
