<script>
import store from './store'
export default {
	onLaunch: async function () {
		console.log('App Launch')
		await store.dispatch("user/wechat_login")
		await store.dispatch("recruit/fetch_first_recruits")
		await store.dispatch("community/fetch_first_posts")
	},
	onShow: function () {
		console.log('App Show')
	},
	onHide: function () {
		console.log('App Hide')
	}
}
</script>

<style>
/*每个页面公共css */
</style>
