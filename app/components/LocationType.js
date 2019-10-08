import Vue from 'vue/dist/vue.js';
import { store } from '../store/store.js'
import * as Constants from '../constants/constants'
import VueMixins from "../mixins/mixins"
import Multiselect from 'vue-multiselect'


/**
 * Location type dropdown component
 */
export default Vue.component('LocationType', {
    template: '#LocationTypeDropdownTemplate',
    store,
    mixins: [VueMixins],
    data () {
        return {
            initialLoad : true,
            locationTypeSelection: {},
            options: []                       
        }
    },

    components: {
        Multiselect
    },     

    /**
     * Created | Lifecycle hook
     */    
    created () {
        /**
         * Read JSON object from DOM probided by backend
         */
        let locationVariables = JSON.parse(document.getElementById('LocationTypeVariables').innerHTML);
        let obj = locationVariables.options;
        this.locationTypeSelection = locationVariables.selection;

        /**
         * Updates store/state with the location type object for later manipulation
         */
        this.$store.dispatch('AssignLocationTypeObject', locationVariables);               
        

        /**
         * Build dropdown
         */
        obj.forEach((item) => {
            this.options.push(item);
        })
    },

    watch : {   
        /**
         * Watches for any changes to the filter dropdown.
         * Adds query param with value to the URL
         */
        locationTypeSelection () {   
            
            let newObj;

            if(this.initialLoad) {
                if((this.getLocationType === 'Urgent Care') || (this.getLocationType === 'Emergency Department')) {
                    newObj = this.sortByObj[0].options.filter(f => f.name !== 'Wait time').concat([{name: 'Wait time'}]) 
                // this.locationTypeSelection.name = this.getLocationType;
                } else {
                    newObj = this.sortByObj[0].options.filter(e => e.name !== 'Wait time');
                }

                let initlaFinalObj = {
                    "options": newObj,
                    "selection" : { "name": "Distance" }
                }                    
                this.$store.dispatch('AssignSortByObject', initlaFinalObj);
            }
            
            this.initialLoad = false;

            /**
             * Wait times should only be available on ER and Urgent Care
             */
            if(this.locationTypeSelection){
                if( (this.locationTypeSelection.name === 'Urgent Care') || (this.locationTypeSelection.name === 'Emergency Department') ) {
                    newObj = this.sortByObj[0].options.filter(f => f.name !== 'Wait time').concat([{name: 'Wait time'}])                                   
                } else {
                    newObj = this.sortByObj[0].options.filter(e => e.name !== 'Wait time');       
                }
            

                if(!this.initialLoad) {
                    this.onCreteQuery({ 'Field' : Constants.LOCATION_TYPE, 'Value' : this.locationTypeSelection.name });            
                    
                    let finalObj = {
                        "options": newObj,
                        "selection" : { "name": "Distance" }
                    }                    
                    this.$store.dispatch('AssignSortByObject', finalObj);        
                }

                this.$store.dispatch('AssignLocationType', this.locationTypeSelection.name);               
                
            }
        },

        getClearAll (obj) {
            this.resetInput(obj)
        },
        
        getLocationType (val) {
            this.manageLocationType(val);
        }
    }, 

    computed : {
        sortByObj () {
            return this.$store.getters.getSortByObj;
        },

        getClearAll () {            
            return this.$store.getters.getClearAll
        },
        
        getLocationType () {
            return this.$store.getters.getLocationType
        },

        getLocationTypeObj () {
            return this.$store.getters.getLocationTypeObj
        }
    },

    methods : {
        generateDropdown ({ name }) {
            return `${name}`
        },

        /**
         * Resets input field based on state
         * @param {*} val 
         */        
        resetInput(val) {
     //       console.log('resetInput function triggered');
     //       Vue.set(this, 'locationTypeSelection', { "name": "All Locations" });
        },
        
        manageLocationType(val) {
            console.log(val)
        }
    }  
});             
 