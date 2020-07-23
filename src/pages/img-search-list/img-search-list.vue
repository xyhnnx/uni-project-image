<template>
	<view class="grid">
		<view class="grid-c-06" v-for="(item, index) in dataList" :key="item.src">
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
				search: '美女',
				lastDataArr: [],
				fetchPageNum: 0,
				fetchPageSize: 5
			}
		},
		onLoad(e) {
			this.search = e.search;
			uni.setNavigationBarTitle({
				title: '专题：' + e.search
			});
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
			if (this.lastDataArr.length < this.fetchPageSize) {
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
				wx.cloud.init()                              //调用前需先调用init
				ret = await wx.cloud.callFunction({
					name: 'getSearchImg',
					data: {
						search: this.search,
						pageNo: this.fetchPageNum + 1,
						pageSize: this.fetchPageSize,
					}
				})
				console.log('ret', ret)
				// errMsg: "collection.get:ok"
				if (ret.errMsg !== 'cloud.callFunction:ok') {
					console.log('请求失败', ret)
					uni.showToast({
						title: '请求失败，请重试',
						icon: 'none',
					});
					return;
				}
				// this.totalCount = ret.result.totalCount || 0
				if(ret.result.status !== 0) {
					uni.showToast({
						title: '加载失败，请重新搜索',
						icon: 'none',
					});
					return
				}
				const data = ret.result.data;
				if(data.length < this.fetchPageSize) {
					this.loadMoreText = '没有更多了'
				}
				this.lastDataArr = data;


				if (this.refreshing && data[0].src === this.dataList[0].src) {
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
						title: item.desc,
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
			},
			newGuid() {
				let s4 = function() {
					return (65536 * (1 + Math.random()) | 0).toString(16).substring(1);
				}
				return (s4() + s4() + "-" + s4() + "-4" + s4().substr(0, 3) + "-" + s4() + "-" + s4() + s4() + s4()).toUpperCase();
			},
			goDetail(e,index) {
				uni.navigateTo({
					url: `/pages/detail/detail?list=${encodeURIComponent(JSON.stringify(this.dataList))}&index=${index}&fromPage=img-search-list`
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
