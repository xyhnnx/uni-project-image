<template>
	<view class="new-page">
		<view class="list-box">
			<view v-for="(item, index) in dataList"
				  @tap="goDetail(index)"
				  :key="item.src"
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
	export default {
		data() {
			return {
				categoryId: '',
				totalDataList: [],
				loadMoreText: '',
				loading: false,
				num: 10,
				nextPageUrl: null
			}
		},
		computed: {
			dataList () {
				return this.totalDataList.map(e => {
					return {
						src: e.url
					}
				})
			},
		},
		onReachBottom() {
			console.log('滑动到页面底部')
			if (!this.nextPageUrl) {
				this.loadMoreText = '已经到底啦'
				return;
			}
			this.getData()
		},

		methods: {
			async getData() {
				this.loadMoreText = '加载中...'
				await this.getListData()
				this.loadMoreText = ''
			},
			goDetail(index) {
				console.log(index)
				uni.previewImage({
					current: this.dataList[index].src,
					urls: [this.dataList[index].src]
				})
			},
			async getListData() {
				if(this.loading) {
					return
				}
				let data = {
					nextPageUrl: this.nextPageUrl,
					categoryId: this.categoryId
				}
				this.loading = true
				let res = await api.getKaiYanTagItemList(data)
				this.loading = false
				if(res && res.itemList && res.itemList.length) {
					this.totalDataList.push(...res.itemList)
				}
				this.nextPageUrl = res && res.nextPageUrl
			},
		},
		async onLoad(query) {
			uni.setNavigationBarTitle({
				title: query.name || ''
			});
			this.categoryId = query.id
			await this.getListData()

		},
	}
</script>

<style scoped lang="stylus">
@import "../../uni.styl"
.new-page
	display block
	width 100%
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
		padding 10px
		color #fff
.list-box
	width 100%
	display flex
	flex-wrap wrap
	box-sizing border-box
	padding 1px 0
	.list-item
		&:nth-child(2n)
			.img
				padding-right 0
		width 50%
		height calc(100vh / 2)
		.img
			box-sizing border-box
			width 100%
			height 100%
			padding 0 1px 1px 0
			display block

</style>
