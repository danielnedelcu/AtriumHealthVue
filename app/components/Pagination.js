import Vue from 'vue/dist/vue.js';
import { store } from '../store/store.js'
import * as Constants from '../constants/constants'
import VueMixins from "../mixins/mixins"
import { Pagination } from 'bootstrap-vue/es/components';

Vue.use(Pagination);

/**
 * Pagination component
 */
export default Vue.component('PaginationComponent', {
    template: '#PaginationTemplate',
    store,
    mixins: [VueMixins],

    data () {
        return {}
    },

    computed : {
        /**
         * State Object
         */
        toggle () {
            return this.$store.getters.getToggleMap
        },

        /**
         * Gets current page index
         */
        currentPage : {
            get : function() {
                return this.$store.getters.getCurrentPage
            },

            set : function(index) {   
                /**
                 * Update query params for the pageNumber.
                 */
                this.onCreteQuery ({ 'Field' : Constants.PAGE_NUMBER, 'Value' : index })
                
                /**
                 * Updates state
                 */
                this.$store.dispatch('AssignPage', index)                  
            }
        },

        /**
         * Total number of physicians per query
         */
        resultsTotal () {
            
            return this.$store.getters.getLocationsTotal;
        },       
        
        /**
         * Physicians to show per page
         */
        itemsPerPage () {
            return this.$store.getters.getLocationsPageSize;
        },

        // /**
        //  * Loading status
        //  */
        // loading () {
        //     return this.$store.getters.getLoadingStatus
        // }
    },

    methods : {
        /**
         * On pagination change
         * 
         * @param {*} index 
         */
        onChange (index) {  
            setTimeout(function () {
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;   
            },250)            
        }
    }  
});       