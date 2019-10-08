import Vue from 'vue/dist/vue.js';
import { store } from '../store/store.js'
import * as Constants from '../constants/constants'
import VueMixins from "../mixins/mixins"
import {URIMixin} from '../mixins/URI'
import Services from '../services/services'


/**
 * City / Zip input field component
 */
export default Vue.component('City', {
    template: '#CityInputTemplate',
    store,
    mixins: [URIMixin, VueMixins],
    
    data () {
        return {
            cityName : '',
            cityCoordinates: '',
            onError : false    
        }
    },

    watch : {   
        /**
         * State object
         */
        cityCoordinates () {
            return this.$store.getters.getCityCoordinates
        },
        
        /**
         * State object
         */
        cityName (obj) {
            if(!this.cityName.length) {
                this.resetSearch();
            }

            this.onError = false;
        },
        
        getClearAll (obj) {
            this.resetInput(obj)
        }
    }, 

    computed : {
        cityName () {
            return this.$store.getters.getCityName
        },

        getClearAll () {            
            return this.$store.getters.getClearAll
        }
    },

    /**
     * CREATED | Lifecycle hook
     * 
     */
    created () {
        /**
         * If there's cityName as a query param, prepopulate our input
         * field with the value.
         */
        this.cityName = this.$store.getters.getCityName

        const _self = this;
        const query = this.getURI(window.location.href);
        
        if(query.latitude === "" || query.longitude === "") {
            if (navigator.geolocation) {
              try {
                navigator.geolocation.getCurrentPosition(
                    (position) => {    
                      /**
                       * The mechanism is to only update one query parameter at a time
                       * but since we need to change lat/long together, we need to add
                       * them to an array, instead of just an object.
                       */
                      this.onCreateGeometry(
                        [
                            { 'Field' : Constants.LATITUDE, 'Value' : position.coords.latitude },
                            { 'Field' : Constants.LONGITUDE, 'Value' : position.coords.longitude }
                        ]
                    )
    
                    }
                )
              } catch (err) {}                    
            }
        }       

        /**
         * Updates store/state with the appropriate lat/lng
         */
        this.$store.dispatch('AssignCityOrZip', {"lat": query.latitude, "lng" : query.longitude});           
    },  

    methods : {
        /**
         * Resets input field based on state
         * @param {*} val 
         */        
        resetInput(val) {
            if(val) {
                this.cityName = '';
            }
        },

        /**
         * Resets global search
         */
        resetSearch () {      
            this.onCreteQuery({ 'Field' : Constants.CITY_NAME, 'Value' : '' }, false); 
            this.onCreteQuery({ 'Field' : Constants.PAGE_NUMBER, 'Value' : 1 }, false); 
            this.onCreateGeometry(
                [
                    { 'Field' : Constants.LATITUDE, 'Value' : Constants.DEFAULT_LATITUDE },
                    { 'Field' : Constants.LONGITUDE, 'Value' : Constants.DEFAULT_LONGITUDE }
                ], true
            )

            this.$store.dispatch('AssignCityName', '');  
            this.$store.dispatch('AssignPage', 1)     
        },

        /**
         * Once search is clicked
         */
        onSearchCity () {
            /**
             * Checks whether the entered items fit into the zip or name category.
             */
            if ( this.isValidUSZip(this.cityName) ||  this.isValidName(this.cityName)) {
                this.GetGeoLocation(this.cityName)     
            } else {
                this.onError = true;
            }
        },     

        /**
         * Calls Google Maps API (currently using my personal.
         * 
         * @param {payload} Alpha or Numeric 
         */
		async GetGeoLocation(payload) {		
			let data;

            let response = await Services.getGeocoding(payload);
            
            /**
             * Appropriate data only if the Google Maps API
             * returns actual data for location. Else, show error
             */
            if(response.data.results.length !== 0) {
                data = response.data.results[0].geometry.location;
                           
                /**
                 * Updates store/state with the appropriate lat/lng
                 */
                this.$store.dispatch('AssignCityOrZip', data);   

                /**
                 * Updates store/state with the appropriate city name
                 */
                this.$store.dispatch('AssignCityName', payload);

                /**
                 * Update query params for the cityName.
                 * This method does not make call to API.
                 */
                this.onCreteQuery ({ 'Field' : Constants.CITY_NAME, 'Value' : this.cityName }, false)
                
                /**
                 * The mechanism is to only update one query parameter at a time
                 * but since we need to change lat/long together, we need to add
                 * them to an array, instead of just an object.
                 */
                this.onCreateGeometry(
                    [
                        { 'Field' : Constants.LATITUDE, 'Value' : data.lat },
                        { 'Field' : Constants.LONGITUDE, 'Value' : data.lng }
                    ]
                )
            } else {
                this.onError = true;
            }							
		}	
    }  
});             
 