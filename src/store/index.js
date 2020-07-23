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
	},
	mutations: {
		login(state, userName) {
			state.userName = userName || '新用户';
			state.hasLogin = true;
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
