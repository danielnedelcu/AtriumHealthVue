import Vue from 'vue/dist/vue.js';
import { store } from '../store/store.js'
import * as Constants from '../constants/constants'
import VueMixins from "../mixins/mixins"
import Multiselect from 'vue-multiselect'

/**
 * Toggle button component
 */
export default Vue.component('ToggleButton', {
    template: '#ToggleButtonTemplate',
    store,
    mixins: [VueMixins],
    data () {
        return {             
            toggle : 1,
            toggleMessage : 'Show Map View'
        }
    },  
    
    /**
     * Created | Lifecycle hook
     */
    created () {},

    watch : {   
        toggle () {
            return this.$store.getters.getToggleMap
        },
    }, 

    computed : {},

    methods : {
        onToggleView () {
            /**
             * Toggles the label content of the toggle button depending on which view 
             * the user is on
             */
            this.toggleMessage  = (this.toggle) ? 'Show List View' : 'Show Map View';
            
            /**
             * Updates store/state with the appropriate toggle value
             */
            this.$store.dispatch('AssignMapToggle', this.toggle ^= 1);               
            
        }
    }  
});             
