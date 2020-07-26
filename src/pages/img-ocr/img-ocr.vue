<template>
	<view class="wrap">
		<!-- camera.wxml -->
		<camera :device-position="devicePosition" :flash="flash" class="camera"></camera>
		<view class="bottom">
			<view style="height: 10px;"></view>
			<view class="camera-btn">
				<button class="btn" type="primary" @click="changeDevicePosition">切换镜头</button>
				<view class="split"></view>
				<button class="btn" type="primary" @click="changeFlash">闪光灯：{{flash}}</button>
			</view>
			<view style="height: 10px;"></view>
			<button type="primary" @click="takePhoto">拍照识别文字</button>
			<view style="height: 10px;"></view>
			<button type="primary" @click="uploadClick">上传图片识别文字</button>

			<view class="text-content-list">
				<textarea :maxlength="-1" auto-height="true" class="text-area" :value="resultList.map(e=>e.words).join('\n')" v-if="resultList && resultList.length">
				</textarea>
			</view>

		</view>
	</view>
</template>

<script>
	import * as util from '../../common/util'
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
				flash: 'off', // auto, on, off 闪关灯
				resultList: [],
				devicePosition: 'back' // front 前置摄像头；back后置摄像头
			};
		},
		computed: mapState(['userInfo','config']),
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
						} else  if(this.config.saveImageTextRecognitionResult){ // 判断是否保存图片识别结果
							this.uploadImageRecognition(imgPath,data.words_result)
						}
					}
				})

			},
			// 上传图片和识别结果
			async uploadImageRecognition (path, words_result) {
				// 将图片上传至云存储空间
				let res = await wx.cloud.uploadFile({
					// 指定上传到的云路径 不能以/开头
					cloudPath: `user-images-recognition/${path.split('/')[path.split('/').length - 1]}`,
					// 指定要上传的文件的小程序临时文件路径
					filePath: path
				})
				if(res.statusCode === 204) {
					wx.cloud.callFunction({
						name: 'addDataToCould',
						data: {
							dbName: 'userImageRecognitionList',
							list: [
								{
									fileID: res.fileID,
									recognitionResult: words_result
								}
							]
						}
					})
				}

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
		.text-area
			display block
			width 100%
			height auto
	.camera-btn
		padding 0 10px
		display flex
		.btn
			flex 1
		.split
			width 20px
</style>
