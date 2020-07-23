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
		methods: {
			...mapMutations(['login','setStateData']),
			bindGetUserInfo (e) {
				// e.detail.userInfo.isLogin = true
				wx.cloud.init()                              //调用前需先调用init
				wx.cloud.callFunction({
					name: 'addDataToCould',
					data: {
						dbName: 'userList',
						primaryKey: 'openId',
						list: [e.detail.userInfo]
					}
				}).then(async res => {
					console.log(this.setStateData)
					this.setStateData({
						userInfo: e.detail.userInfo,
					})
					// userInfoData = await wx.cloud.callFunction({
					// 	name: 'getDbListData',
					// 	data: {
					// 		dbName: 'userList',
					// 		pageNo: 1,
					// 		pageSize: 1,
					// 		isUserInfo: true
					// 	}
					// })
					// console.log(userInfoData)
					uni.showToast(
							{
								title: `登陆成功!`,
								icon: 'none',
							}
					);
					uni.reLaunch({
						url: '/page/user/user',
					});
				})


			},
		}
	}
</script>

<style>

</style>
