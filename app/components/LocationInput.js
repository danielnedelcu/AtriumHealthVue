import Vue from 'vue/dist/vue.js';
import { store } from '../store/store.js'
import * as Constants from '../constants/constants'
import VueMixins from "../mixins/mixins"


/**
 * Location input component
 */
export default Vue.component('LocationInput', {
    template: '#LocationInputTemplate',
    inheritAttrs: false,
    store,
    mixins: [VueMixins],
    props: ['label', 'value'],
    data () {
        return {
            locationName : ''        
        }
    },

    computed: {
        getClearAll () {            
            return this.$store.getters.getClearAll
        }        
    }, 
    
    watch : {   
        /**
         * State object
         */
        locationName () {
            if(!this.locationName.length) {
                this.resetSearch();
            }
        },
        
        getClearAll (obj) {
            this.resetInput(obj)
        }        
    }, 

    /**
     * CREATED | Lifecycle hook
     * 
     */
    created () {
        /**
         * If there's locationName as a query param, prepopulate our input
         * field with the value.
         */
        this.locationName = this.$store.getters.getLocationName
    },  


    methods : {
        /**
         * Resets input field based on state
         * @param {*} val 
         */
        resetInput(val) {
            if(val) {
                this.locationName = '';
            }
        },

        /**
         * Resets global search
         */
        resetSearch () {      
            this.onCreteQuery({ 'Field' : Constants.PAGE_NUMBER, 'Value' : 1 }, false); 

            this.onCreateGeometry(
                [
                    { 'Field' : Constants.LATITUDE, 'Value' : Constants.DEFAULT_LATITUDE },
                    { 'Field' : Constants.LONGITUDE, 'Value' : Constants.DEFAULT_LONGITUDE }
                ], false
            )

            this.onCreteQuery({ 'Field' : Constants.LOCATION_NAME, 'Value' : '' }, true); 

            this.$store.dispatch('AssignLocationName', '');      
            this.$store.dispatch('AssignPage', 1)     
        },

        onSearchLocation () {
            /**
             * Updates store/state with the appropriate location name
             */
            this.$store.dispatch('AssignLocationName', this.locationName);            

            /**
             * Checks whether the entered items fit into the name category.
             */            
            if(this.isValidName(this.locationName)) {
                this.onCreteQuery({ 'Field' : Constants.LOCATION_NAME, 'Value' : this.locationName }); 
            }
        },     
    }  
});             
 