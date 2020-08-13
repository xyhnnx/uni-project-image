<template>
	<view class="index">
		<view class="tags">
			<block v-for="(value, index) in tagList" :key="index">
				<view class="tag" @tap="goList(value)">
					<image class="tag-img" :src="value.cover"></image>
					<text class="tag-text">{{value.name}}({{value.count}}张)</text>
				</view>
			</block>
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
.search-btn
	width 100%
	margin 10px
</style>
