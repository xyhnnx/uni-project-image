<template>
	<form class='loginView'>
		<!--<view class="input-view">-->
			<!--<view class="label-view">-->
				<!--<text class="label">账号 </text>-->
			<!--</view>-->
			<!--<input class="input" type="text" placeholder="请输入用户名" name="nameValue" />-->
		<!--</view>-->
		<!--<view class="input-view">-->
			<!--<view class="label-view">-->
				<!--<text class="label">密码</text>-->
			<!--</view>-->
			<!--<input class="input" type="password" placeholder="请输入密码" name="passwordValue" />-->
		<!--</view>-->
		<view class="button-view">
			<!--<button type="default" class="login" hover-class="hover" formType="submit">登录</button>-->
			<!--<button type="default" class="register" hover-class="hover" @click="register">免费注册</button>-->
			<button open-type="getUserInfo" @getuserinfo="bindGetUserInfo">微信一键登陆</button>
		</view>
	</form>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {};
		},
        computed: mapState(['userInfo']),
		methods: {
			...mapMutations(['getUserInfo','setStateData']),
			bindGetUserInfo (e) {
				e.detail.userInfo.isLogin = true
				wx.cloud.init()                              //调用前需先调用init
				wx.cloud.callFunction({
					name: 'addDataToCould',
					data: {
						dbName: 'userList',
						primaryKey: 'openId',
						list: [e.detail.userInfo]
					}
				}).then(async res => {
					await this.getUserInfo()
					uni.showToast(
							{
								title: `登录成功!`,
								icon: 'none',
							}
					);
					uni.reLaunch({
						url: '/pages/center/center',
					});
				})
			},
		},
		async onLoad() {
			await this.getUserInfo();
			console.log(this.userInfo)
			if(this.userInfo && this.userInfo.openId) {
				uni.reLaunch({
					url: '/pages/new/new',
				});
			}
		}
	}
</script>

<style>

</style>
