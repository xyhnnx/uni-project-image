<template>
	<view class="list-box">
		<view v-for="(value, index) in tagList"
			  @tap="goList(value)"
			  :key="index"
			  class="list-item">
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
		computed: mapState(['tagList']),
		methods: {
			goList(value) {
				uni.navigateTo({
					url: `../list/list2?id=${value.id}&name=${value.name}`
				})
			},
		},
		// 加了这个页面才可以被分享
		onShareAppMessage () {
		},
		async onLoad() {
		}
	}
</script>

<style scoped lang="stylus">
	.list-box
		width 100%
		box-sizing border-box
		display: grid;
		grid-template-columns: 1fr 1fr
		grid-gap: 10px;
		grid-auto-rows: calc(100vh / 2)
		padding 0
		.list-item
			position relative
			display block
			box-sizing border-box
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
					font-size 24px
					line-height 50px
					margin-top 20px
				.des
					color #fff
					font-size 10px
				.count
					color #fff
					font-size 12px
</style>
