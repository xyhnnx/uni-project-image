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
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data: []
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
				const $ = db.command.aggregate
				let res =  await db.collection('userImageList').aggregate()
				.group({
					_id: '$openId',
					num: $.sum(1)
				})
				.end()
				console.log(res)
				// 再每组取一条数据
				if(res && res.list && res.list.length) {
					let list2 = []
					for(let i = 0;i< res.list.length;i++) {
						let item = res.list[i]
						let res2 = await db.collection('userImageList').where({
							openId: item._id
						}).limit(1).get()
						console.log(res2);
						let data = res2.data[0]
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
			}
		},
		onLoad() {
			this.getImageData();
			this.getUserImageData();
		}
	}
</script>

<style>

</style>
