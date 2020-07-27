<template>
	<view class="index">
		<swiper @change="swpierChange" :style="{height:screenHeight + 'px'}" :current="index">
			<swiper-item v-for="(value,index) in data" :key="value.src" @click="preImg(index)">
				<image :src="value.src" mode="aspectFill"></image>
			</swiper-item>
		</swiper>
		<!-- #ifndef H5 -->
		<view class="detail-btn-view">
			<view class="download" @click="download"></view>
			<!-- #ifdef APP-PLUS -->
			<view v-if="showBtn" class="setting" @click="setting">设为壁纸</view>
			<!-- #endif -->
			<view class="collect" @click="collect"></view>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgShow: false,
				index: 0,
				showBtn: false,
				screenHeight: 0,
				imgLength: 0,
				fromPage: '',
				providerList: [],
				data: [],
				detailDec: ""
			}
		},
		onLoad(e) {
			// #ifdef APP-PLUS
			if (plus.os.name === 'Android') {
				this.showBtn = true;
			}
			// #endif
			this.screenHeight = uni.getSystemInfoSync().windowHeight;
			let list = JSON.parse(decodeURIComponent(e.list));
			this.imgLength = list.length
			this.index = Number(e.index)
			this.data = list
			this.fromPage = e.fromPage
			this.uploadLookCount()
			uni.setNavigationBarTitle({
				title: (this.index + 1) +"/" + this.imgLength
			});
			// 获取分享通道
			uni.getProvider({
				service: "share",
				success: (e) => {
					let data = []
					for (let i = 0; i < e.provider.length; i++) {
						switch (e.provider[i]) {
							case 'weixin':
								data.push({
									name: '分享到微信好友',
									id: 'weixin'
								})
								data.push({
									name: '分享到微信朋友圈',
									id: 'weixin',
									type: 'WXSenceTimeline'
								})
								break;
							case 'qq':
								data.push({
									name: '分享到QQ',
									id: 'qq'
								})
								break;
							default:
								break;
						}
					}
					this.providerList = data;
				},
				fail: (e) => {
					console.log("获取登录通道失败", e);
				}
			});
		},
		onShareAppMessage() {
			return {
				title: '欢迎使用uni-app看图模板',
				path: '/pages/detail/detail?data=' + this.detailDec,
				imageUrl: this.data[this.index]
			}
		},
		onNavigationBarButtonTap(e) {
			if (e.index === 0) {
				// #ifdef APP-PLUS
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
							summary: '欢迎使用uni-app模版',
							imageUrl: this.data[this.index],
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
				});
				// #endif
				// #ifdef H5
				this.collect();
				// #endif
			}
		},
		methods: {
			async uploadLookCount () {
				const db = wx.cloud.database()
				if(['img-search-list','hot'].includes(this.fromPage)) {
					let res = await db.collection('userSearchImgHistory')
					.where({
						src: this.data[this.index].src
					}).get();
					let res2 = await wx.cloud.callFunction({
						name: 'updateDataToCould',
						data: {
							dbName: 'userSearchImgHistory',
							primaryKey: 'src',
							list: [
								{
									src: this.data[this.index].src
								}
							],
							data: {
								lookCount: res.data[0].lookCount ++
							}
						}
					})
					console.log(res2)

				}
			},
			async download() {
				let funcSave = (filePath)=> {
					wx.saveImageToPhotosAlbum({
						filePath,
						success: () => {
							uni.showToast({
								icon: 'none',
								title: '已保存到手机相册'
							})
						},
						fail: (e) => {
							console.log(e)
							uni.showToast({
								icon: 'none',
								title: '保存到手机相册失败'
							})
						}
					});
				}
				let url = this.data[this.index].src
				if(url.startsWith('http')) {
					wx.downloadFile({
						url,
						success: (e) => {
							funcSave(e.tempFilePath)
						},
						fail: (e) => {
							uni.showModal({
								content: '下载失败，' + e.errMsg,
								showCancel: false
							})
						}
					})
				} else {
					let res = await wx.cloud.downloadFile({
						fileID: url
					})
					funcSave(res.tempFilePath)
				}

			},
			collect() {
				uni.showToast({
					icon: 'none',
					title: '点击收藏按钮'
				})
			},
			//#ifdef APP-PLUS
			setting() {
				uni.showToast({
					icon: 'none',
					title: '正在设为壁纸'
				})
				setTimeout(() => {
					var WallpaperManager = plus.android.importClass('android.app.WallpaperManager');
					var Main = plus.android.runtimeMainActivity();
					var wallpaperManager = WallpaperManager.getInstance(Main);
					plus.android.importClass(wallpaperManager);
					var BitmapFactory = plus.android.importClass('android.graphics.BitmapFactory');
					uni.downloadFile({
						url: this.data[this.index].src,
						success: (e) => {
							var filePath = plus.io.convertLocalFileSystemURL(e.tempFilePath);
							var bitmap = BitmapFactory.decodeFile(filePath);
							try {
								wallpaperManager.setBitmap(bitmap);
								uni.showToast({
									icon: 'none',
									title: '壁纸设置成功'
								})
							} catch (e) {
								uni.showToast({
									icon: 'none',
									title: '壁纸设置失败'
								})
							}
						},
						fail: () => {
							uni.showToast({
								icon: 'none',
								title: '壁纸设置失败'
							})
						}
					})
				}, 100)
			},
			//#endif
			swpierChange(e) {
				this.index = e.detail.current;
				uni.setNavigationBarTitle({
					title: e.detail.current + 1 + '/' + this.imgLength
				})
				this.uploadLookCount()
			},
			preImg(index) {
				if (this.imgShow) { //防止点击过快导致重复调用
					return;
				}
				this.imgShow = true;
				setTimeout(() => {
					this.imgShow = false;
				}, 1000)
				setTimeout(() => {
					uni.previewImage({
						current: this.data[index].src,
						urls: this.data.map(e => e.src)
					})
				}, 150)
			},
			// getData(e) {
			// 	uni.request({
			// 		url: this.$serverUrl + '/api/picture/detail.php?id=' + e,
			// 		success: (res) => {
			// 			if (res.data.code !== 0) {
			// 				uni.showModal({
			// 					content: '请求失败，失败原因：' + res.data.msg,
			// 					showCancel: false
			// 				})
			// 				return;
			// 			}
			//
			// 			this.data = this.data.concat(res.data.data);
			// 		},
			// 		fail: () => {
			// 			uni.showModal({
			// 				content: '请求失败，请重试!',
			// 				showCancel: false
			// 			})
			// 		}
			// 	})
			// }
		}
	}
</script>

<style>
	page {
		background-color: #000;
		height: 100%;
	}

	swiper {
		flex: 1;
		width: 750upx;
		background-color: #000;
		display: flex;
		flex-direction: column;
	}

	swiper-item {
		display: flex;
		align-items: center;
	}

	image {
		width: 750upx;
		height: 1125upx;
	}
</style>
