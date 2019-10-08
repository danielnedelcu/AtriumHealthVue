import Vue from 'vue/dist/vue.js';
import Router from 'vue-router'
import { store } from '../store/store.js'
import Home from '../views/home'


Vue.use(Router)


/**
 * Vue router this.$store.getters.getPathname
 */
export default new Router({    
    mode: 'history',
	routes: [
		{
			path: '*',
			name: 'search',
			component: Home,
			props: route => ({ query: route.query.q })
		}		
	]
})
