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
		async onLoad() {
		}
	}
</script>

<style scoped lang="stylus">
	.list-box
		width 100%
		display flex
		flex-wrap wrap
		box-sizing border-box
		padding 5px 0 0 5px
		.list-item
			position relative
			/*&:nth-child(2n)*/
			/*	padding-right 0*/
			width 50%
			height calc(100vh / 2)
			padding 0 5px 5px 0
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
				padding 3px
				position absolute
				bottom 10px
				right 10px
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
