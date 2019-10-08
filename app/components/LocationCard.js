import Vue from 'vue/dist/vue.js';
import { store } from '../store/store.js'
import * as Constants from '../constants/constants'
import VueMixins from "../mixins/mixins"
import Services from '../services/services'
import Location from '../models/Location'

/**
 * PhysicianCard component
 */
export default Vue.component('LocationCard', {
    template: '#LocationCardTemplate',
    store,
    props : {
        location : { type : Location, required : true }
    },

    data () {
        return {
			hoursAccordionActive: false
		}
    },    

    /**
     * Created | Lifecycle hook
     */
    created () {},

    computed : {},

	methods : {
		
		toggleHoursAccordion () {
			
			this.hoursAccordionActive = !this.hoursAccordionActive;
		}
	}
});             
