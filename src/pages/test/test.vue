<template>
	<form class='loginView' @submit="checkText">
		<view class="input-view">
			<view class="label-view">
				<text class="label">文字 </text>
			</view>
			<input class="input" type="text" placeholder="请输入文字check" name="checkValue" />
		</view>
		<view class="button-view">
			<button type="default" class="login" hover-class="hover" formType="submit">checkText</button>
			<button type="default" class="login" hover-class="hover" @click="addData">add</button>
		</view>
	</form>
</template>

<script>
	export default {
		data() {
			return {};
		},
		methods: {
			checkText(e) {
				let text = e.detail.value.checkValue
				console.log("文字:"+ text)
				wx.cloud.init()                              //调用前需先调用init
				wx.cloud.callFunction({
					name: 'check',
					data: {
						"content": text
					}
				}).then(res => {
					console.log('res',res)
					uni.showToast(
							{
								title: res.result.msg,
								icon: 'none',
							}
					);
				})
			},
			addData () {
				wx.cloud.init()                              //调用前需先调用init
				wx.cloud.callFunction({
					name: 'addImageType',
					data: {
						imageTypeList: [
							{
								"name": 'test-xyh'
							}
						]
					}
				}).then(res => {
					console.log('res',res)
					uni.showToast(
							{
								title: res.result.msg,
								icon: 'none',
							}
					);
				})
			}
		},
		onLoad() {
			console.log('load---')
		}
	}
</script>

<style>

</style>
