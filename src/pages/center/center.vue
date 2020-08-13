<template>
	<view class="center">
		<!--<view class="logo" @click="goLogin" :hover-class="!userInfo.isLogin ? 'logo-hover' : ''">-->
			<!--<image class="logo-img" :src="userInfo.avatarUrl ? userInfo.avatarUrl :avatarUrl"></image>-->
			<!--<view class="logo-title">-->
				<!--<text class="uer-name">Hi，{{userInfo.nickName ? userInfo.nickName : '您未登录'}}</text>-->
				<!--<text class="go-login navigat-arrow" v-if="!userInfo.isLogin">&#xe65e;</text>-->
			<!--</view>-->
		<!--</view>-->
		<view class="logo" :hover-class="!userInfo.isLogin ? 'logo-hover' : ''">
			<button class="get-user-button" @getuserinfo="getUserInfo" open-type="getUserInfo">
				<image class="logo-img" mode="widthFix" :src="userInfo.avatarUrl ? userInfo.avatarUrl :avatarUrl"></image>
				<view class="logo-title">
					<view class="uer-name">{{userInfo.nickName ? userInfo.nickName : '点击授权用户信息'}}
					</view>
				</view>
			</button>
		</view>
		<!--<view class="center-list">-->
			<!--<view class="center-list-item border-bottom">-->
				<!--<text class="list-icon">&#xe60c;</text>-->
				<!--<text class="list-text">收藏图片</text>-->
				<!--<text class="navigat-arrow">&#xe65e;</text>-->
			<!--</view>-->
			<!--<view class="center-list-item">-->
				<!--<text class="list-icon">&#xe60d;</text>-->
				<!--<text class="list-text">收藏图集</text>-->
				<!--<text class="navigat-arrow">&#xe65e;</text>-->
			<!--</view>-->
		<!--</view>-->
		<view class="center-list" v-if="config.showUploadImage || userPower === -1">
			<view class="center-list-item" @click="goUploadImg">
				<text class="list-icon">&#xe61a;</text>
				<text class="list-text">上传图片</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
		</view>
		<view class="center-list">
			<view class="center-list-item border-bottom" @click="goAbout">
				<text class="list-icon">&#xe603;</text>
				<text class="list-text">关于</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			<view class="center-list-item" @click="toImgOcr" v-if="config.showImageRecognition">
				<text class="list-icon">&#xe609;</text>
				<text class="list-text">图片识别</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			<view class="center-list-item" @click="goTest" v-if="config.showTest || userPower === -1">
				<text class="list-icon">&#xe609;</text>
				<text class="list-text">test</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			<view class="center-list-item" @click="toPage('/pages/oil-compute/oil-compute')" v-if="config.showOilConsumptionCompute">
				<text class="list-icon">&#xe609;</text>
				<text class="list-text">油耗计算</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			<view class="center-list-item" @click="toPage('/pages/video-search/video-search')" v-if="config.showSearchVideo">
				<text class="list-icon">&#xe609;</text>
				<text class="list-text">电影搜索</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			<view class="center-list-item" @click="toPage('/pages/page-to-QR/page-to-QR')" v-if="userPower === -1">
				<text class="list-icon">&#xe609;</text>
				<text class="list-text">获取二维码</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				avatarUrl: '/static/logo.png',
			}
		},
		computed: mapState(['userInfo','config', 'userPower']),
		methods: {
			...mapMutations(['getUserInfo','setStateData']),
			goLogin() {
				if (!this.userInfo.isLogin) {
					uni.navigateTo({
						url: '/pages/login/login'
					});
				}
			},
			goAbout() {
				uni.navigateTo({
					url: '/pages/about/about'
				});
			},
			toImgOcr() {
				uni.navigateTo({
					url: '/pages/img-ocr/img-ocr'
				});
			},
			goTest () {
				uni.navigateTo({
					url: '/pages/test/test'
				});
			},
			toPage (url) {
				uni.navigateTo({
					url
				});
			},
			// s是
			goUploadImg () {
				uni.navigateTo({
					url: '/pages/image-upload/image-upload'
				});
			}
		},
      async onPullDownRefresh() {
        await this.$store.commit('getConfig')
		await this.$store.commit('getUserPower')
		  console.log(this.userPower,'userPower')
        uni.stopPullDownRefresh();
      },
		onLoad() {
			this.getUserInfo()

		}
	}
</script>

<style lang="stylus" scoped>
	@import "../../uni.styl"
	.center {
		flex-direction: column;
		min-height: 100vh;
	}
	.logo {
		padding-top 50px
		margin-bottom 20px
		display: block;
		width: 100%;
		box-sizing: border-box;
		overflow: hidden;
		.get-user-button {
			display: flex;
			width: 100%;
			height: 100%;
			background-color: transparent;
			border: none;
			padding: 20px 0 0;
			margin: 0;
			border-radius: 0;
			justify-content: start;
			align-items center
			box-sizing: border-box;
			overflow: hidden;
			margin-top: -1px;
		}
		.logo-img {
			width: 75px;
			height: 75px;
			border: 2px solid #fff;
			margin 0 20px
		}
		.logo-title {
			display: block;
			text-align: center;
			color: #fff;
			.uer-name {
				font-size: 16px;
				line-height: 40px;
			}
			.phone-number {
				font-size: 14px;
			}
		}
	}

	.logo-hover {
		opacity: 0.8;
	}

	.center-list {
		background-color: $uni-list-item-color;
		margin-top: 20upx;
		width: 750upx;
		flex-direction: column;
	}

	.center-list-item {
		height: 90upx;
		width: 750upx;
		box-sizing: border-box;
		flex-direction: row;
		padding: 0upx 20upx;
	}

	.border-bottom {
		border-bottom-width: 0.5px;
		border-color: $uni-border-color;
		border-bottom-style: solid;
	}

	.list-icon {
		width: 40upx;
		height: 90upx;
		line-height: 90upx;
		font-size: 34upx;
		color: $uni-text-color;
		text-align: center;
		font-family: texticons;
		margin-right: 20upx;
	}

	.list-text {
		height: 90upx;
		line-height: 90upx;
		font-size: 34upx;
		color: #555;
		flex: 1;
		text-align: left;
	}

	.navigat-arrow {
		height: 90upx;
		width: 40upx;
		line-height: 90upx;
		font-size: 34upx;
		color: #555;
		text-align: right;
		font-family: texticons;
	}
</style>
