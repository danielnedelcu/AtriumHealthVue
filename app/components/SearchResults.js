import Vue from 'vue/dist/vue.js';
import { store } from '../store/store.js'
import * as Constants from '../constants/constants'
import VueMixins from "../mixins/mixins"

import LocationCard from './LocationCard'

/**
 * Search results component
 */
export default Vue.component('SearchResults', {
    template: '#SearchResultsTemplate',
    store,
    components : {
        LocationCard
    },

    data () {
        return {}
    },

    watch : {},

    computed : {
        /**
         * State object
         */
        locations () {
            return this.$store.getters.getLocations
        },

        /**
         * State Object
         */
        toggle () {
            return this.$store.getters.getToggleMap
        },

        /**
         * State object
         */        
        totalLocations () {
            return this.$store.getters.getLocationsTotal
        },
        
        pageSize () {
            return this.$store.getters.getLocationsPageSize;
        },

        currentPage () {
            return this.$store.getters.getCurrentPage;
        },

        currentIndex () {
            return ((this.currentPage - 1) * this.pageSize) + 1;
        },     
        
        endIndex () {
            let totalPages = Math.ceil(this.totalLocations/this.pageSize);
            let end = (this.currentIndex + this.pageSize) - 1;
            return ((this.currentPage === totalPages ) && (this.lastPageItems < end)) ? (this.currentIndex + this.lastPageItems) - 1 : end;            
        },

        lastPageItems() {
            return this.totalLocations % this.pageSize;
        }
    }
});             
 