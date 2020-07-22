<template>
	<view class="index">
		<view class="tags">
			<block v-for="(value, index) in data" :key="index">
				<view class="tag" @tap="goList(value)">
					<image class="tag-img" :src="value.icon"></image>
					<text class="tag-text">{{value.type}}</text>
				</view>
			</block>
		</view>
		<view class="search-box">
			<input class="input" type="text" placeholder="请输入图片搜索" @change="inputChange" name="checkValue" />
			<button type="default" class="login" hover-class="hover" @click="searchClick">搜索</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data: [],
				search: '美女'
			}
		},
		methods: {
			goList(value) {
				uni.navigateTo({
					url: '../list/list?type=' + value.type + '&id=' + value.id + '&imageType=' + value.imageType
				})
			},
			async getImageData() {
				// 先根据微信名nickName分组
				const db = wx.cloud.database()
				const $ = db.command.aggregate
				let res =  await db.collection('imageItemList').aggregate()
				// group里必须要有一个id
				.group({
					_id: '$title',
					num: $.sum(1)
				})
				.end()
				console.log(res)
				// 再每组取一条数据
				if(res && res.list && res.list.length) {
					let list2 = []
					for(let i = 0;i< res.list.length;i++) {
						let item = res.list[i]
						let res2 = await db.collection('imageItemList').where({
							title: item._id
						}).limit(1).get()
						let data = res2.data[0]
						list2.push({
							type: data.title,
							id: data.title,
							icon: data.img_src,
							imageType: 1
						})
					}
					// 添加到分类
					this.data.push(...list2)

				}
			},
			async getUserImageData() {
				// 先根据微信名openId分组
				const db = wx.cloud.database()
				let ret = await wx.cloud.callFunction({
					name: 'getImageUser',
					data: {
					}
				})
				console.log(ret);
				let result = ret.result
				// 再每组取一条数据
				if(result && result.data && result.data.length) {
					let list2 = []
					for(let i = 0;i< result.data.length;i++) {
						let data = result.data[i]
						list2.push({
							type: data.nickName,
							id: data.openId,
							icon: data.avatarUrl,
							imageType: 2
						})
					}
					// 添加到分类
					this.data.push(...list2)

				}
			},
			inputChange (e) {
				console.log(e)
				this.search = e.detail.value
			},
			searchClick () {
				console.log('searchClick')
				uni.navigateTo({
					url: '/pages/img-search-list/img-search-list?search=' + this.search
				})
			}
		},
		onLoad() {
			this.getImageData();
			this.getUserImageData();
		}
	}
</script>

<style scoped >
.search-box {
	display: flex;
	flex-direction: column;
	padding-bottom: 10px;
}
</style>
