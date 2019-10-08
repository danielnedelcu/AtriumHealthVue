import Vue from 'vue/dist/vue.js';
import { store } from '../store/store.js'
import * as Constants from '../constants/constants'
import VueMixins from "../mixins/mixins"


/**
 * Is Pediatric checkbox component
 */
export default Vue.component('Pediatrics', {
    template: '#PediatricsTemplate',
    store,
    mixins: [VueMixins],
    data () {
        return {
            checked: false    
        }
    },

    computed : {
        /**
         * State Object
         */        
        checkPediatrics() {
            return this.$store.getters.getPediatric;
        },
    },

    watch : {   
        /**
         * Listends to the state property perpetually
         */
        checkPediatrics (obj) {
            this.resetCheckbox(obj);
        },

        /**
         * Updates the query params with true/false depending on the checkbox click
         */
        checked () {
            this.onCreteQuery({ 'Field' : Constants.CHILDRENS_LOCATION_ONLY, 'Value' : this.checked }); 
            this.$store.dispatch('AssignPediatric', this.checked);
            
            return this.$store.getters.getPediatric;
        }

    }, 

    methods : {
        resetCheckbox (obj) {
           this.checked = obj;
        }
    },

    /**
     * CREATED | Lifecycle hook
     * 
     */
    created () {
        /**
         * If there's getPediatric as a query param, prepopulate our checkbox
         * if true, or leave empty if false.
         */
        this.checked = this.$store.getters.getPediatric;
    }
});             
 