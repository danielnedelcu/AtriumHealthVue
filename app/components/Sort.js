import Vue from 'vue/dist/vue.js';
import { store } from '../store/store.js'
import * as Constants from '../constants/constants'
import VueMixins from "../mixins/mixins"
import Multiselect from 'vue-multiselect'

/**
 * Sort by dropdown component
 */
export default Vue.component('Sort', {
    template: '#SortDropdownTemplate',
    store,
    mixins: [VueMixins],
    data () {
        return {             
            initialLoad : true,
            sortSelection: {},
            options: [],
            updatedSelection: {}            
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
        let sortVariables = JSON.parse(document.getElementById('SortByVariables').innerHTML);        
        let obj = sortVariables.options;
        this.sortSelection = sortVariables.selection;

        /**
         * Updates store/state with the sort object for later manipulation
         */
        this.$store.dispatch('AssignSortByObject', sortVariables);        

        /**
         * Build dropdown
         */
        obj.forEach((item) => {
            this.options.push(item);
        })
    },

    watch : {   
        sort (obj) {
           this.options = obj[0].options;
           this.resetInput(obj)
        },

        /**
         * Watches for any changes to the SORT dropdown.
         * Adds query param with value to the URL
         */        
        sortSelection () {
            if(!this.initialLoad) this.onCreteQuery({ 'Field' : Constants.SORT_BY, 'Value' : this.sortSelection.name });
            this.initialLoad = false;
        },

        getClearAll (obj) {
            this.resetInput(obj)
        }        
    }, 

    computed : {
        /**
         * State object
         */
        sort () {            
            return this.$store.getters.getSortByObj
        },       

        getClearAll () {            
            return this.$store.getters.getClearAll
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
            Vue.set(this, 'sortSelection', { "name": "Distance" });
        }      
    }  
});             
 