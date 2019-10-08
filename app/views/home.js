import Vue from 'vue/dist/vue.js';
import { store } from '../store/store.js'
import * as Constants from '../constants/constants.js'
import City from '../components/City'
import LocationInput from '../components/LocationInput'
import Sort from '../components/Sort'
import LocationType from '../components/LocationType'
import SearchResults from '../components/SearchResults'
import Pediatrics from '../components/PediatricCheckbox'
import PaginationComponent from '../components/Pagination'
import ToggleButton from '../components/ToggleButton'
import ClearSearchButton from '../components/ClearSearchButton'
import Map from '../components/Map'

export default Vue.component('Home', {
    template: '#HomeTemplate',
    store,
    data() {
        return {
  
        }
    },

    watch : {

    },    

    components: {
        'LocationInput' : LocationInput,
        'City' : City,        
        'Sort' : Sort,
        'LocationType' : LocationType,
        'SearchResults' : SearchResults,
        'Pediatrics' : Pediatrics,
        'ToggleButton' : ToggleButton,
        'ClearSearchButton' : ClearSearchButton,
        'Map' : Map,
        'PaginationComponent' : PaginationComponent

    },

    methods : {
   
    }    
});             
 