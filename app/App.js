import Vue from 'vue/dist/vue.js';
import { store } from './store/store.js'
import * as Constants from './constants/constants'
import URI from 'urijs'
import VueMixins from "./mixins/mixins"
import {URIMixin} from './mixins/URI'

export default Vue.component('App', {
    template: '#LocationTemplate',
    store,
    mixins: [URIMixin, VueMixins],

    data () {
      return {}
    },

    props: {
      query: {
        type: String,
        default: '',
      },
    },   

    created () {
      /**
       * Parse all query params
       *  */
      const query = this.getURI(window.location.href);
      const path = new URI(window.location.href);
      this.$store.dispatch('AssignPathname', path.pathname()); 
      
      var isMyObjectEmpty = !Object.keys(query).length;

      if(!isMyObjectEmpty) {
        /**
         * Loop through and build global facet object based on key/value
         */
        for (const [key, value] of Object.entries(query)) {          
          this.$store.dispatch('AddGlobalQuery', {'Field' : `${key}`,'Value' :`${value}`})    
          
            
          if(`${value}` !== '') {
            switch(key) {
              case Constants.CITY_NAME :
                  this.$store.dispatch('AssignCityName', value);
              break;            
              case Constants.LOCATION_NAME :
                  this.$store.dispatch('AssignLocationName', value);
              break;
              case Constants.LATITUDE:                                     
                
                  break;       
              case Constants.LONGITUDE:                                     
                
                  break;                                                      
              case Constants.SORT_BY:                   
                
                  break;    
              case Constants.CHILDRENS_LOCATION_ONLY:                   
                  this.$store.dispatch('AssignPediatric', (value == 'true'));
                  break;                                    
              case Constants.LOCATION_TYPE:                   
                  this.$store.dispatch('AssignLocationType', value);
                  break;     
              case Constants.PAGE_SIZE:                   
                  
                  break;  
              case Constants.PAGE_NUMBER:         
                  let currentPage = (value || this.$store.getters.getCurrentPage);      
                  this.$store.dispatch('AssignPage', currentPage);    
                  break;                                                        
                        

            }
          } else {
            switch(key) {
              case Constants.PAGE_NUMBER:         
                  let currentPage = (value || this.$store.getters.getCurrentPage);
                  this.$store.dispatch('AssignPage', currentPage);    
                  this.$store.dispatch('AddGlobalQuery', {'Field' : 'pageNumber','Value' : currentPage})               
                  break;   
            }
          }  
        }  
      } else {
        this.onCreateGeometry(
        [
            { 'Field' : Constants.LATITUDE, 'Value' : this.$store.getters.getLatitude },
            { 'Field' : Constants.LONGITUDE, 'Value' : this.$store.getters.getLongitude }
        ])

        for(var i = 0; i < this.$store.getters.getGlobalQuery.QueryParams.length; ++i ) { 
          this.$store.dispatch('AddGlobalQuery', {'Field' : this.$store.getters.getGlobalQuery.QueryParams[i].Field,'Value' : this.$store.getters.getGlobalQuery.QueryParams[i].Value})                  
        }            
      }

      // Builds Query
      this.onBuildQuery();



      // Calls API with new data
      this.$store.dispatch('PostData', this.$store.getters.getUrlQuery);
    }
} )   