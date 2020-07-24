import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		primaryColor: '#fb7349',
		/**
		 * 是否需要强制登录
		 */
		forcedLogin: true,
		hasLogin: false,
		userInfo: {},
		config: {},
	},
	mutations: {
		async getUserInfo(state) {
			let userInfoData = await wx.cloud.callFunction({
				name: 'getDbListData',
				data: {
					dbName: 'userList',
					pageNo: 1,
					pageSize: 1,
					limitType: 1
				}
			})
			state.userInfo = userInfoData.result.data[0];
		},
		async getConfig(state) {
			let resData = await wx.cloud.callFunction({
				name: 'getDbListData',
				data: {
					dbName: 'config',
					pageNo: 1,
					pageSize: 1,
					limitType: 3
				}
			})
			console.log(resData)
			state.config = resData.result.data[0];
		},
		logout(state) {
			state.userName = "";
			state.hasLogin = false;
		},
		setStateData (state, obj = {}) {
			Object.keys(obj).forEach(key => {
				state[key] = obj[key]
			})
		}
	}
})

export default store
