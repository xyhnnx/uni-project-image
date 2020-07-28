<template>
	<view class="index-hot">
		<view class="grid">
			<view class="grid-c-06" v-for="(item,index) in dataList" :key="item.src">
				<view class="panel" @click="goDetail(item,index)">
					<image class="card-img card-list2-img" mode="aspectFill" :src="item.src"></image>
					<!--<text class="card-num-view card-list2-num-view">{{item.img_num}}P</text>-->
					<view class="card-bottm row">
						<view class="car-title-view row">
							<text class="card-title card-list2-title">{{item.title}}</text>
						</view>
						<view @click.stop="share(item)" class="card-share-view"></view>
					</view>
				</view>
			</view>
		</view>
		<text class="loadMore">{{loadMoreText}}</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				refreshing: false,
				loadMoreText: '加载中...',
				dataList: [],
				totalCount: 0,
				fetchPageNum: 0,
				fetchPageSize: 5
			}
		},
		async onLoad() {
			this.getData();
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
					console.log('获取登录通道失败', e);
				}
			});
		},
		onReachBottom() {
			console.log('滑动到页面底部')
			if ((this.fetchPageNum) *this.fetchPageSize >= this.totalCount || this.dataList.length >= this.totalCount) {
				this.loadMoreText = '没有更多了'
				return;
			}
			this.getData();
		},
		onPullDownRefresh() {
			console.log('下拉刷新');
			this.refreshing = true;
			this.fetchPageNum = 0;
			this.getData();
		},
		methods: {
			async getData() {
				this.loadMoreText = '加载中...'
				// 先根据微信名nickName分组
				const db = wx.cloud.database()
				// uni.request({
				// 	url: this.$serverUrl + '/api/picture/list.php?type=' + this.id,
				// 	success: (ret) =>
				// });
				let ret = {};
				ret = await wx.cloud.callFunction({
					name: 'getDbListData',
					data: {
						dbName: 'userSearchImgHistory',
						pageNo: this.fetchPageNum + 1,
						pageSize: this.fetchPageSize,
						params: {
						},
						orderName: 'createTime',
						orderType: 'desc'
					}
				})
				// errMsg: "collection.get:ok"
				if (ret.errMsg !== 'cloud.callFunction:ok') {
					console.log('请求失败', ret)
					return;
				}
				if(ret.result.totalCount === 0) { // 没有数据则获取公共数据
					ret = await wx.cloud.callFunction({
						name: 'getDbListData',
						data: {
							dbName: 'commonImageList',
							pageNo: this.fetchPageNum + 1,
							pageSize: this.fetchPageSize,
							limitType: 3,
							params: {
							},
						}
					})
				}
				this.totalCount = ret.result.totalCount
				const data = ret.result.data;
				if (this.refreshing && data[0] && data[0]._id === this.dataList[0]._id) {
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
					list.push({
						src: item.src,
						title: item.title || item.search,
						_id: item._id
					});
				}


				if (this.refreshing) {
					this.refreshing = false;
					uni.stopPullDownRefresh();
					this.dataList = list;
				} else {
					this.dataList = this.dataList.concat(list);
					this.fetchPageNum += 1;
				}
				if(data.length < this.fetchPageSize) {
					this.loadMoreText = '没有更多了'
				}
				if(this.dataList && this.dataList.length<=0) {
					this.loadMoreText = '暂无数据'
					this.refreshing = false;
					uni.stopPullDownRefresh();
					this.dataList = list;

				}
			},
			newGuid() {
				let s4 = function() {
					return (65536 * (1 + Math.random()) | 0).toString(16).substring(1);
				}
				return (s4() + s4() + "-" + s4() + "-4" + s4().substr(0, 3) + "-" + s4() + "-" + s4() + s4() + s4()).toUpperCase();
			},
			goDetail(e,index) {
				uni.navigateTo({
					url: `/pages/detail/detail?list=${encodeURIComponent(JSON.stringify(this.dataList))}&index=${index}&fromPage=hot`
				});
			},
			share(e) {
				if (this.providerList.length === 0) {
					uni.showModal({
						title: '当前环境无分享渠道!',
						showCancel: false
					})
					return;
				}
				let itemList = this.providerList.map(function(value) {
					return value.name
				})
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
								})
							}
						});
					}
				})
			}
		}
	}
</script>

<style scoped lang="stylus">
	.index-hot
		display flex
		flex-wrap wrap
		justify-content center
	.grid{
		padding-top: 10px;
	}
	.loadMore
		text-align center
</style>
