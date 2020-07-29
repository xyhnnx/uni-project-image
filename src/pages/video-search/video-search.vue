<template>
	<view class="wrap">
		<view class="search-box">
			<SearchBtn placeholder="请输入关键字搜索" v-model="search" @searchClick="searchClick"></SearchBtn>
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
				search: ''
			};
		},
		components: {SearchBtn},
        computed: mapState(['userInfo']),
		methods: {
			...mapMutations(['getUserInfo','setStateData']),
			searchClick () {
				wx.cloud.callFunction({
					name: 'puppeteerUtil',
					data: {
						search: this.search || '美女'
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
</style>
