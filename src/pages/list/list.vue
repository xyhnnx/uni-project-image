<template>
	<view class="grid">
		<view class="grid-c-06" v-for="(item, index) in dataList" :key="item.guid">
			<view class="panel" @click="goDetail(item)" @longpress="imgLongpress(item, index)">
				<image class="card-img card-list2-img" mode="aspectFill" :src="item.img_src"></image>
				<text class="card-num-view card-list2-num-view"></text>
				<view class="card-bottm row">
					<view class="car-title-view row">
						<text class="card-title card-list2-title">{{item.title}}</text>
					</view>
					<view @click.stop="share(item)" class="card-share-view"></view>
				</view>
			</view>
		</view>
		<view class="grid-c-12">
			<text class="loadMore">{{loadMoreText}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				refreshing: false,
				loadMoreText: '加载中...',
				dataList: [],
				id: 0,
				imageType: 0,
				totalCount: 0,
				fetchPageNum: 0,
				fetchPageSize: 5
			}
		},
		onLoad(e) {
			this.imageType = Number(e.imageType);
			uni.setNavigationBarTitle({
				title: '专题：' + e.type
			});
			this.id = e.id;
			// 防止app里由于渲染导致转场动画卡顿
			setTimeout(() => {
				this.getData();
			}, 300);
			uni.getProvider({
				service: 'share',
				success: (e) => {
					let data = [];
					for (let i = 0; i < e.provider.length; i++) {
						switch (e.provider[i]) {
							case 'weixin':
								data.push({
									name: '分享到微信好友',
									id: 'weixin'
								});
								data.push({
									name: '分享到微信朋友圈',
									id: 'weixin',
									type: 'WXSenceTimeline'
								});
								break;
							case 'qq':
								data.push({
									name: '分享到QQ',
									id: 'qq'
								});
								break;
							default:
								break;
						}
					}
					this.providerList = data;
				},
				fail: (e) => {
					console.log('获取分享通道失败', e);
				}
			});
		},
		onPullDownRefresh() {
			console.log('下拉刷新');
			this.refreshing = true;
			this.fetchPageNum = 0;
			this.getData();
		},
		onReachBottom() {
			console.log('上拉加载刷新',this.totalCount,this.fetchPageNum);
			if ((this.fetchPageNum) *this.fetchPageSize >= this.totalCount || this.dataList.length >= this.totalCount) {
				this.loadMoreText = '没有更多了'
				return;
			}
			this.getData();
		},
		methods: {
			addDataToCould (list) {
				wx.cloud.init()                              //调用前需先调用init
				wx.cloud.callFunction({
					name: 'addDataToCould',
					data: {
						dbName: 'imageItemList',
						primaryKey: 'id',
						list
					}
				}).then(res => {
					uni.showToast(
							{
								title: `添加数量${res.result.data.addCount}条`,
								icon: 'none',
							}
					);
				})
			},
			async getData(e) {
				// 先根据微信名nickName分组
				const db = wx.cloud.database()
				// uni.request({
				// 	url: this.$serverUrl + '/api/picture/list.php?type=' + this.id,
				// 	success: (ret) =>
				// });
				let ret = {};
				if(this.imageType === 2) { // 用户图片
					ret = await wx.cloud.callFunction({
						name: 'getDbListData',
						data: {
							dbName: 'userImageList',
							pageNo: this.fetchPageNum + 1,
							pageSize: this.fetchPageSize,
							params: {
								openId: this.id
							}
						}
					})
				}else{
					ret = await wx.cloud.callFunction({
						name: 'getDbListData',
						data: {
							dbName: 'imageItemList',
							pageNo: this.fetchPageNum + 1,
							pageSize: this.fetchPageSize,
							params: {
								title: this.id
							}
						}
					})
				}
				// errMsg: "collection.get:ok"
				if (ret.errMsg !== 'cloud.callFunction:ok') {
					console.log('请求失败', ret)
					return;
				}
				this.totalCount = ret.result.totalCount
				const data = ret.result.data;

				if (this.refreshing && data[0]._id === this.dataList[0]._id) {
					uni.showToast({
						title: '已经最新',
						icon: 'none',
					});
					this.refreshing = false;
					uni.stopPullDownRefresh();
					return;
				}

				let list = [];
				for (var i = 0; i < data.length; i++) {
					var item = data[i];
					item.guid = this.newGuid() + item._id
					if(this.imageType === 2) {
						list.push({
							guid: item.guid,
							img_src: item.fileID,
							img_num: 1,
							_id: item._id,
							title: item.nickName,
						});
					} else{
						list.push(item);
					}
				}

				if (this.refreshing) {
					this.refreshing = false;
					uni.stopPullDownRefresh();
					this.dataList = list;
				} else {
					this.dataList = this.dataList.concat(list);
					this.fetchPageNum += 1;
				}
			},
			newGuid() {
				let s4 = function() {
					return (65536 * (1 + Math.random()) | 0).toString(16).substring(1);
				}
				return (s4() + s4() + "-" + s4() + "-4" + s4().substr(0, 3) + "-" + s4() + "-" + s4() + s4() + s4()).toUpperCase();
			},
			imgLongpress (e, index) {
				console.log('imageType', this.imageType)
				if(this.imageType === 2) { // 用户上传的图片
					let arr = ['删除'];
					uni.showActionSheet({
						itemList: arr,
						success: (res) => {
							if(res.tapIndex === 0) {
								console.log('shancheba', e)
								wx.cloud.init()                              //调用前需先调用init
								wx.cloud.callFunction({
									name: 'delDataFromCould',
									data: {
										dbName: 'userImageList',
										primaryKey: '_id',
										list: [
											{
												_id: e._id
											}
										]
									}
								}).then(res => {
									uni.showToast(
											{
												title: `删除成功！`,
												icon: 'none',
											}
									);
									this.dataList.splice(index, 1)
								})
							}
						},
						fail: function (res) {
							console.log(res.errMsg);
						}
					});
				}
			},
			goDetail(e) {
				uni.navigateTo({
					url: '/pages/detail/detail?data=' + encodeURIComponent(JSON.stringify(e))
				});
			},
			share(e) {
				if (this.providerList.length === 0) {
					uni.showModal({
						title: '当前环境无分享渠道!',
						showCancel: false
					});
					return;
				}
				let itemList = this.providerList.map(function(value) {
					return value.name;
				});
				uni.showActionSheet({
					itemList: itemList,
					success: (res) => {
						uni.share({
							provider: this.providerList[res.tapIndex].id,
							scene: this.providerList[res.tapIndex].type && this.providerList[res.tapIndex].type === 'WXSenceTimeline' ?
								'WXSenceTimeline' : 'WXSceneSession',
							type: 0,
							title: 'uni-app模版',
							summary: e.title,
							imageUrl: e.img_src,
							href: 'https://uniapp.dcloud.io',
							success: (res) => {
								console.log('success:' + JSON.stringify(res));
							},
							fail: (e) => {
								uni.showModal({
									content: e.errMsg,
									showCancel: false
								});
							}
						});
					}
				});
			}
		},
	}
</script>

<style scoped>
	.grid {
		padding-top: 10px;
	}

	.grid-c-12 {
		justify-content: center;
	}
</style>
