<template>
	<view class="button-view">
		<!-- 如果只是展示用户头像昵称，可以使用 <open-data /> 组件 -->
		<open-data type="userAvatarUrl"></open-data>
		<open-data type="userNickName"></open-data>
		<!-- 需要使用 button 来授权登录 -->
		<button v-if="canIUse" open-type="getUserInfo" @getuserinfo="bindGetUserInfo">上传图片</button>
		<view v-else>请升级微信版本</view>
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
				canIUse: wx.canIUse('button.open-type.getUserInfo')
			};
		},
		computed: mapState(['userInfo']),
		methods: {
			...mapMutations(['getUserInfo','setStateData']),
			bindGetUserInfo (e) {
				if(this.userInfo.isLogin) {
					this.uploadClick(this.userInfo);
				}else{
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
						this.uploadClick(e.detail.userInfo);
					})
				}
			},
			uploadClick (userInfo) {
				// 让用户选择一张图片
				wx.chooseImage({
					success:  async (chooseResult) => {
						uni.showLoading({
							title: '图片上传中'
						})
						console.log('chooseResult-',chooseResult)
						try{
							let uploadList = []
							for (let i = 0;i<chooseResult.tempFiles.length;i++) {
								let item = chooseResult.tempFiles[i]
								// 将图片上传至云存储空间
								let res = await wx.cloud.uploadFile({
									// 指定上传到的云路径 不能以/开头
									cloudPath: `user-images/${item.path.split('/')[item.path.split('/').length - 1]}`,
									// 指定要上传的文件的小程序临时文件路径
									filePath: item.path
								})
								if(res.statusCode === 204) {
									let data = {
										...userInfo,
										fileID: res.fileID,
										size: item.size
									}
									uploadList.push(data)

								}
							}
							// 保存到数据库
							let res = await this.addDataToCould(uploadList);

							if(res.result.status === 0) {
								uni.showToast(
										{
											title: `成功上传${res.result.data.addCount}张图片`,
											icon: 'none',
										}
								);
							}
						}catch (e) {
							uni.showToast(
									{
										title: `上传失败！${e}`,
										icon: 'none',
									}
							);
						}finally {
							setTimeout(()=>{
								uni.hideLoading()
							}, 1000)
						}


					},
				})
			},
			async addDataToCould (list) {
				wx.cloud.init() //调用前需先调用init
				return wx.cloud.callFunction({
					name: 'addDataToCould',
					data: {
						dbName: 'userImageList',
						primaryKey: 'fileID',
						list
					}
				})
			},
		},
		onLoad() {
		}
	}
</script>

<style>
.center{
	text-align: center;
}
</style>
