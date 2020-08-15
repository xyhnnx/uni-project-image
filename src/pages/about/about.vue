<template>
	<view class="about">
		<view class="content">
			<view class="qrcode">
				<!-- #ifdef APP-PLUS -->
				<image src="https://img.cdn.aliyun.dcloud.net.cn/stream/qr/__UNI__FAD3FD9.png/256" @longtap="save"></image>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<image src="//img.cdn.aliyun.dcloud.net.cn/stream/qr/__UNI__FAD3FD9.png/256"></image>
				<!-- #endif -->
				<text class="tip">{{notice.title || ''}}</text>
				<view class="content-box">
					<view class="item" v-for="(item, index) in notice.content" :key="index">
						{{item.label || ''}}
					</view>
				</view>
				<text class="time">{{notice.time || ''}}</text>
			</view>
			<view class="desc">
			</view>
			<!-- #ifdef APP-PLUS -->
			<button type="primary" @click="share">分享</button>
			<!-- #endif -->
		</view>
		<!-- #ifdef APP-PLUS -->
		<view class="version">
			当前版本：{{version}}
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	import {mapState} from "vuex";
	export default {
		data() {
			return {
				providerList: [],
				notice: {},
				version: '',
				sourceLink: 'https://github.com/dcloudio/uni-template-picture'
			}
		},
		computed: mapState(['config']),
		onLoad() {
			console.log(this.config)
			this.notice = this.config && this.config.notice
		},
		methods: {
			// #ifdef APP-PLUS
			save() {
				uni.showActionSheet({
					itemList: ['保存图片到相册'],
					success: () => {
						plus.gallery.save('https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/app_download.png', function() {
							uni.showToast({
								title: '保存成功',
								icon: 'none'
							})
						}, function() {
							uni.showToast({
								title: '保存失败，请重试！',
								icon: 'none'
							})
						});
					}
				})
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
								'WXSenceTimeline' : "WXSceneSession",
							type: 0,
							title: '欢迎体验uni-app',
							summary: 'uni-app 是一个使用 Vue.js 开发跨平台应用的前端框架',
							imageUrl: 'https://img-cdn-qiniu.dcloud.net.cn/uploads/nav_menu/8.jpg',
							href: "https://m3w.cn/uniapp",
							success: (res) => {
								console.log("success:" + JSON.stringify(res));
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
			},
			// #endif
			openLink() {
				if (plus) {
					plus.runtime.openURL(this.sourceLink);
				} else {
					window.open(this.sourceLink);
				}
			}
		}
	}
</script>

<style scoped lang="stylus">
	.time
		text-align right
		margin-top 20px
		width 100%
		font-size 10px
	.content-box
		display block
		width 100%
		.item
			display block
			text-align left
			line-height 40px
	.tip
		width 100%
		text-align center
		margin-top: 30px
		margin-bottom 20px
		font-size 18px
	page,
	view {
		display: flex;
	}

	page {
		min-height: 100%;
	}

	image {
		width: 360upx;
		height: 360upx;
	}

	.about {
		flex-direction: column;
		flex: 1;
	}

	.content {
		flex: 1;
		padding: 30upx;
		flex-direction: column;
		justify-content: center;
	}

	.qrcode {
		display: flex;
		align-items: center;
		flex-direction: column;
	}

	.qrcode .tip {
		margin-top: 20upx;
	}

	.desc {
		margin-top: 30upx;
		display: block;
	}

	.code {
		color: #e96900;
		background-color: #f8f8f8;
	}

	button {
		width: 100%;
		margin-top: 40upx;
	}

	.version {
		height: 80upx;
		line-height: 80upx;
		justify-content: center;
		color: #ccc;
	}

	.source {
		margin-top: 30upx;
		flex-direction: column;
	}

	.source-list {
		flex-direction: column;
	}

	.link {
		color: #007AFF;
	}
</style>
