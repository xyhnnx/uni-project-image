<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
          wx.cloud.init({
            env: 'test-xyh',
            traceUser: true
          }) //调用前需先调用init
          console.log('wx.cloud.init()')
          this.$store.commit('getConfig')
          this.$store.commit('getUserPower')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="stylus">
	@import './common/common.styl';
    @import "./uni.styl"
	page,
	view {
		display: flex;
	}

	page {
		display: flex;
		min-height: 100%;
		background-color: $uni-color-primary;
	}

	template {
		display: flex;
		flex: 1;
	}
</style>
