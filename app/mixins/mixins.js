import Vue from 'vue'
import {store} from '../store/store'
import * as Constants from '../constants/constants'
import URI from 'urijs'

/**
 * Global Mixin
 */
export default Vue.mixin({
    methods : {
        /**
         * Checks if null
         * @returns boolean
         * @param {*} element 
         */
        isNull (element) {
            return element === null;
        },

        /**
         * Checks if undefined
         * @returns boolean
         * @param {*} element 
         */
        isUndefined (element) {
            return element === void 0;
        },        

        /**
         * Compares selected dropdown to items in finalArray
         *
         * @param { arr } finalArray
         * @param { obj } dropdown
         */
        contains ( arr, obj ) {
            return arr.some((item) =>                        
                item === obj )
        },         

        /**
         * Validates for proper zipcode
         */
        isValidUSZip (zip) {
            return /^\d{5}(-\d{4})?$/.test(zip);
        },      
        
        /**
         * Validates for alpha characters
         */        
        isValidName (name) {
            return /^[a-zA-Z-,](\s{0,1}[a-zA-Z-, ])*[^\s]$/.test(name)
        },  

        /**
         * Updates UI per query params
         * 
         * @param {*} obj 
         */
        setStateChange (obj ) {       
            /**
             * Resets page count to 1
             */            
            this.$store.dispatch('AssignPage', 1) 
            
        },

        onCreateGeometry(obj, bool = true) {
            const self = this;

            for (const arrItem of obj ) {	     
                /**
                 * Remove Any duplicate items that match the new object
                 * 
                 */
                this.$store.getters.getGlobalQuery.QueryParams = this.$store.getters.getGlobalQuery.QueryParams.filter(e => e.Field !== arrItem.Field);
    
                /**
                 * Add new object to array
                 */
                this.$store.getters.getGlobalQuery.QueryParams.push(arrItem);
            }	

            /**
             * Builds query
             */
            let parsedQuery = this.onBuildQuery()  
            let pathname =  this.$store.getters.getPathname;
        
            self.$router.push({ path: pathname, query: parsedQuery})

            if(bool) this.$store.dispatch('PostData', this.$store.getters.getUrlQuery);            
        },

        /**
         * 
         * @param {*} obj 
         */
        onCreteQuery(obj, bool = true) {
            
            const self = this;

            // if(!Array.isArray(obj)) {

            /**
             * Remove Any duplicate items that match the new object
             * 
             */
            this.$store.getters.getGlobalQuery.QueryParams = this.$store.getters.getGlobalQuery.QueryParams.filter(e => e.Field !== obj.Field);
  
            /**
             * Add new object to array
             */
            this.$store.getters.getGlobalQuery.QueryParams.push(obj);
            
            /**
             * Builds query
             */
            let parsedQuery = this.onBuildQuery();
            let pathname =  this.$store.getters.getPathname;   

            self.$router.push({ path: pathname, query: parsedQuery})

            if(bool) this.$store.dispatch('PostData', this.$store.getters.getUrlQuery);         
        },
      
        
        onBuildQuery() {
            /**
             * Builds query
             */
            var uri = new URI(window.location.href);
            for(var i = 0; i < this.$store.getters.getGlobalQuery.QueryParams.length; ++i ) {                
                uri.setSearch(this.$store.getters.getGlobalQuery.QueryParams[i].Field, this.$store.getters.getGlobalQuery.QueryParams[i].Value);                
            }                        
            var uriSearch = uri.search()    
            // console.log(uriSearch) 
            // State ( urlQuery ) defined        
            this.$store.dispatch('AddUrlQuery', uriSearch)               
            return URI.parseQuery(uriSearch);  
        }
    }

})