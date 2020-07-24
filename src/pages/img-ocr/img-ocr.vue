<template>
	<view class="wrap">
		<!-- camera.wxml -->
		<camera :device-position="devicePosition" :flash="flash" class="camera"></camera>
		<view class="bottom">
			<view style="height: 10px;"></view>
			<view class="camera-btn">
				<button class="btn" type="primary" @click="changeDevicePosition">切换镜头</button>
				<button class="btn" type="primary" @click="changeFlash">闪光灯：{{flash}}</button>
			</view>
			<view style="height: 10px;"></view>
			<button type="primary" @click="takePhoto">拍照识别文字</button>
			<view style="height: 10px;"></view>
			<button type="primary" @click="uploadClick">上传图片识别文字</button>

			<view class="text-content-list">
				<template v-if="resultList && resultList.length">
					<view class="list-item" v-for="(item, index) in resultList" :key="index">
						{{item.words}}
					</view>
				</template>
			</view>

		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import {ocrAccurate} from '../../common/imgOcr'
	export default {
		data() {
			return {
				canIUse: wx.canIUse('button.open-type.getUserInfo'),
				src: '',
				flash: 'on', // auto, on, off 闪关灯
				resultList: [],
				devicePosition: 'back' // front 前置摄像头；back后置摄像头
			};
		},
		computed: mapState(['userInfo']),
		methods: {
			...mapMutations(['getUserInfo','setStateData']),
			changeDevicePosition () {
				this.devicePosition = this.devicePosition === 'back'?'front':'back'

			},
			changeFlash () {
				if(this.flash === 'on') {
					this.flash = 'off'
				} else if(this.flash === 'off') {
					this.flash = 'auto'
				} else {
					this.flash = 'on'
				}
			},

			uploadClick () {
				this.resultList = []
				// 让用户选择一张图片
				wx.chooseImage({
					success:  async (chooseResult) => {
						uni.showLoading({
							title: '图片上传中'
						})
						try{
							for (let i = 0;i<chooseResult.tempFiles.length;i++) {
								let item = chooseResult.tempFiles[i]
								await this.urlTobase64(item.path)
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
			takePhoto() {
				this.resultList = []
				const ctx = wx.createCameraContext()
				ctx.takePhoto({
					quality: 'high',
					success: (res) => {
						this.urlTobase64(res.tempImagePath)
					}
				})
			},
			async urlTobase64(imgPath) {
				// 读取图片的base64文件内容
				await wx.getFileSystemManager().readFile({
					filePath: imgPath, //选择图片返回的相对路径
					encoding: 'base64',
					success: async (res) => {
						uni.showLoading({
							title: '图片识别中...'
						})
						console.log(res,'resresres')
						let base64Data = '' + res.data
						let data = await ocrAccurate(base64Data)
						this.resultList.push(...data.words_result)
						uni.hideLoading()
						if(data.words_result.length === 0) {
							uni.showToast(
									{
										title: `暂无识别内容`,
										icon: 'none',
									}
							);
						}
					}
				})

			},
			error(e) {
				console.log(e.detail)
			}
		},
		onLoad() {
		}
	}
</script>

<style scoped lang="stylus">
	.wrap
		display flex
		flex-direction column
		width 100%
		height 100%
		.camera
			width 100%
			height 300px;
		.bottom
			display block
			width 100%
	.text-content-list
		padding 10px
		display block
		.list-item
			display block
			width 100%
			line-height 20px
	.camera-btn
		padding 0 10px
		display flex
		.btn
			flex 1
</style>
