<template>
	<view class="center">
		<view class="logo" @click="goLogin" :hover-class="!userInfo.isLogin ? 'logo-hover' : ''">
			<image class="logo-img" :src="userInfo.avatarUrl ? userInfo.avatarUrl :avatarUrl"></image>
			<view class="logo-title">
				<text class="uer-name">Hi，{{userInfo.nickName ? userInfo.nickName : '您未登录'}}</text>
				<text class="go-login navigat-arrow" v-if="!userInfo.isLogin">&#xe65e;</text>
			</view>
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
		<view class="center-list" v-if="config.showUploadImage">
			<!--<view class="center-list-item border-bottom">-->
				<!--<text class="list-icon">&#xe60b;</text>-->
				<!--<text class="list-text">管理图片</text>-->
				<!--<text class="navigat-arrow">&#xe65e;</text>-->
			<!--</view>-->
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
			<view class="center-list-item" @click="goTest" v-if="config.showTest">
				<text class="list-icon">&#xe609;</text>
				<text class="list-text">test</text>
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
		computed: mapState(['userInfo','config']),
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
			// s是
			goUploadImg () {
				uni.navigateTo({
					url: '/pages/image-upload/image-upload'
				});
			}
		},
      async onPullDownRefresh() {
        await this.getUserInfo()
        uni.stopPullDownRefresh();
      },
		onLoad() {
			this.getUserInfo()
		}
	}
</script>

<style>
</style>
