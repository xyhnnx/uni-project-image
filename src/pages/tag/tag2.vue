<template>
	<view class="list-box">
		<view v-for="(value, index) in tagList"
			  @tap="goList(value)"
			  :key="index"
			  class="list-item-wrap">
			<view class="list-item">
				<image class="img"
					   :src="value.coverBlurred"
					   mode="aspectFill">
				</image>
				<image class="img-cover"
					   :src="value.cover"
					   mode="aspectFill">
				</image>
				<view class="text-box">
					<view class="name">{{value.name}}</view>
					<view class="des">{{value.description}}</view>
					<view class="count">- {{value.count}}张 -</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import SearchBtn from '../components/search-btn'
	import {mapState} from "vuex";

	export default {
		components: {
			SearchBtn
		},
		data() {
			return {
				search: ''
			}
		},
		computed: mapState(['tagList', 'config']),
		methods: {
			goList(value) {
				uni.navigateTo({
					url: `/pages/list/list2?id=${value.id}&name=${value.name}`
				})
			},
			showInterstitialAd () {
				// 在页面中定义插屏广告
				let interstitialAd = null
				// 在页面onLoad回调事件中创建插屏广告实例
				if (wx.createInterstitialAd && this.config && this.config.showAd) {
					interstitialAd = wx.createInterstitialAd({
						adUnitId: 'adunit-e59ec30af04a3191'
					})
					interstitialAd.onLoad(() => {})
					interstitialAd.onError((err) => {})
					interstitialAd.onClose(() => {})
					interstitialAd.show()
				}
			}
		},
		// 加了这个页面才可以被分享
		onShareAppMessage () {
		},
		async onLoad() {
			if(!(this.tagList && this.tagList.length)) {
				this.$store.commit('getTagList')
			}
			setTimeout(() => {
				// #ifdef  MP-WEIXIN
				this.showInterstitialAd()
				// #endif
			}, 1000)
		}
	}
</script>

<style scoped lang="stylus">
	.list-box
		width 100%
		box-sizing border-box
		display: flex
		flex-wrap wrap
		padding 0
		.list-item-wrap
			width 50%
			height calc(100vh / 2)
			.list-item
				position relative
				display block
				box-sizing border-box
				width 100%
				height: 100%
				.img
					box-sizing border-box
					width 100%
					height 100%
					display block
				.img-cover
					box-sizing border-box
					width 50%
					height 50%
					display block
					background #fff
					padding 2px
					position absolute
					bottom 12px
					right 12px
				.text-box
					position absolute
					padding 10px
					top 0
					left 0
					right 0
					bottom 50%
					z-index 2
					display flex
					flex-direction column
					.name
						color #fff
						font-size 30px
						line-height 50px
						margin-top 20px
					.des
						color #fff
						font-size 10px
					.count
						color #fff
						line-height 30px
						font-size 18px
</style>
