<template>
	<view class="wrap">
		<view class="search-box">
			<SearchBtn placeholder="pages/center/center" searchText="搜索" v-model="search" @searchClick="searchClick"></SearchBtn>
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
						name: 'getPageQR',
						data: {
							path: this.search
						}
					})
					uni.hideLoading()
				} catch (e) {
					uni.hideLoading()
					uni.showToast(
							{
								title: '生成失败，请重试',
								icon: 'none',
							}
					);
				}
				if(res.errMsg === 'cloud.callFunction:ok' && res.result.status === 0) {
					console.log('res',res)
				} else {
					uni.showToast(
							{
								title: res.result.msg,
								icon: 'none',
							}
					);
				}
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

.center
	text-align center
	margin 20px
	color #999
</style>
