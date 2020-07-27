<template>
	<form class='loginView'>
		<view class="input-view">
			<input class="input" type="number" v-model="unitPrice" placeholder="请输入油价（元/升）"/>
		</view>
		<view class="input-view">
			<input class="input" type="number" v-model="totalPrice" placeholder="加油的总价格（元）"/>
		</view>
		<view class="input-view">
			<input class="input" type="number" v-model="km" placeholder="行驶里程数（公里）"/>
		</view>
		<view class="button-view">
			<button type="primary" @click="compute">计算</button>
		</view>
		<view class="result-box">
			<view class="card-item">
				<text class="label">百公里油耗 </text>
				<text class="value">{{oil100}}升</text>
			</view>
			<view class="card-item">
				<text class="label">一公里耗费 </text>
				<text class="value">{{money1km}}元</text>
			</view>
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
			return {
				unitPrice: '',
				totalPrice: '',
				km: '',
				oil100: 0,
				money1km: 0
			};
		},
        computed: mapState(['userInfo']),
		methods: {
			...mapMutations(['getUserInfo','setStateData']),
			compute () {
				let msgArr = []
				if(isNaN(Number(this.unitPrice)) || !this.unitPrice) {
					this.unitPrice = ''
					msgArr.push('油价')
				}
				if(isNaN(Number(this.totalPrice)) || !this.totalPrice) {
					this.totalPrice = ''
					msgArr.push('总价格')
				}
				if(isNaN(Number(this.km)) || !this.km) {
					this.km = ''
					msgArr.push('里程数')
				}
				if(msgArr.length) {
					uni.showToast(
							{
								title: `请输入${msgArr.join('，')}`,
								icon: 'none',
							}
					);
					return
				}
				let unitPrice = Number(this.unitPrice)
				let totalPrice = Number(this.totalPrice)
				let km = Number(this.km)
				let money1km = (totalPrice / km).toFixed(2)
				let oil100 = (this.totalPrice / this.unitPrice / km * 100).toFixed(2)
				let isSame = this.money1km === money1km && this.oil100 === oil100
				this.money1km = money1km
				this.oil100 = oil100
				if(!isSame) {
					wx.cloud.callFunction({
						name: 'addDataToCould',
						data: {
							dbName: 'userOilCompute',
							list: [
								{
									unitPrice,
									totalPrice,
									km,
									oil100: this.oil100,
									money1km: this.money1km
								}
							]
						}
					}).then(res => {
					})
				}
			}
		},
		async onLoad() {
		}
	}
</script>

<style lang="stylus" scoped>
	.result-box
		display flex
		padding 20px 10px 10px;
		justify-content space-between
	.card-item
		display flex
		align-items center
		.label
			margin-right 5px
		.value
			color green
</style>
