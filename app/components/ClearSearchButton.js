import Vue from 'vue/dist/vue.js';
import { store } from '../store/store.js'
import * as Constants from '../constants/constants'
import VueMixins from "../mixins/mixins"

/**
 * Clear search button component
 */
export default Vue.component('ClearAllButton', {
    template: '#ClearAllButtonTemplate',
    store,
    mixins: [VueMixins],
    data () {
        return {             

        }
    },  
    
    /**
     * Created | Lifecycle hook
     */
    created () {},

    watch : {   

    }, 

    computed : {},

    methods : {
        onClearFilters () {
            this.$store.dispatch('AssignCityName', '');
            this.$store.dispatch('AssignLocationName', '');      
            this.$store.dispatch('AssignPage', 1)     
            this.$store.dispatch('AssignPediatric', false);   
            this.$store.dispatch('AssignClearAll', true);
                        
             this.onCreteQuery({ 'Field' : Constants.CITY_NAME, 'Value' : '' }, false); 
             this.onCreteQuery({ 'Field' : Constants.LOCATION_NAME, 'Value' : '' }, false); 
             this.onCreteQuery({ 'Field' : Constants.PAGE_NUMBER, 'Value' : 1 }, false); 
             this.onCreteQuery({ 'Field' : Constants.SORT_BY, 'Value' : '' }, false); 

             this.onCreateGeometry(
                 [
                     { 'Field' : Constants.LATITUDE, 'Value' : Constants.DEFAULT_LATITUDE },
                     { 'Field' : Constants.LONGITUDE, 'Value' : Constants.DEFAULT_LONGITUDE }
                 ], true
             )                                    
        }
    }  
});             
