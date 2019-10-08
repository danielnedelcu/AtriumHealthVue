import Vue from 'vue/dist/vue.js';

import Vuex from 'vuex';
// import router from './router'
import Services from '../services/services'
import * as Constants from '../constants/constants'
import Location from '../models/Location'

import "babel-polyfill";
import { cpus } from 'os';

Vue.use(Vuex)

export const store = new Vuex.Store({
	/**
	 * Defines the properties of our state
	 */
	state: {
		clearAll : false,
		pathname:'',
		currentPage: 1,
		latitude: Constants.DEFAULT_LATITUDE,
		longitude: Constants.DEFAULT_LONGITUDE,
		locationType:'',
		locationTypeObj: [],
		sortByObj: [],
		locationName:'',
		cityName:'',
		childrenOnly: false,
		pageSize: 10,
		locationResultsTotal : 0,
		urlQuery : '',
		locations : [],
		toggleMap: 1,
		GlobalQuery : {
			'QueryParams': [
				{'Field' : 'cityName', 'Value' : ''},
				{'Field' : 'locationType', 'Value' : ''},				
				{'Field' : 'locationName', 'Value' : ''},
				{'Field' : 'pageNumber', 'Value' : ''},						
				{'Field' : 'latitude', 'Value' : ''},				
				{'Field' : 'longitude', 'Value' : ''},				
				{'Field' : 'sortBy', 'Value' : ''},				
				{'Field' : 'childrensLocationOnly', 'Value' : false}
			]
		}		
	},

	/**
	 * Getter methods that are called from our application
	 */
	getters: {
		getCityCoordinates : (state) => state.geocoordinates,
		getCityName : (state) => state.cityName,
		getLocationName : (state) => state.locationName,
		getLocations : (state) => state.locations,
		getLocationsTotal : (state) => state.locationResultsTotal,
		getLocationsPageSize : (state) => state.pageSize,
		getLongitude : (state) => state.longitude,
		getLatitude : (state) => state.latitude,
		getLocationType : (state) => state.locationType,
		getCurrentPage : (state) => state.currentPage,
		getPediatric : (state) => state.childrenOnly,
		getGlobalQuery : (state) => state.GlobalQuery,
		getUrlQuery : (state) => state.urlQuery,
		getToggleMap : (state) => state.toggleMap,
		getSortByObj : (state) => state.sortByObj,
		getLocationTypeObj : (state) => state.locationTypeObj,
		getPathname : (state) => state.pathname,
		getClearAll : (state) => state.clearAll
	},

	/**
	 * Mutations set the state
	 */
	mutations : {
		assignClearAll (state, obj) {
			state.clearAll = obj;
		},

		assignPathname (state, obj) {
			state.pathname = obj;
		},		

		assignSortByObject (state, obj) {
			state.sortByObj.splice(0, state.sortByObj.length);
			state.sortByObj.push( obj );
		},

		assignLocationTypeObject (state, obj) {
			state.locationTypeObj.push( obj );
		},		

		assignResultsTotal (state, obj) {
			state.locationResultsTotal = obj.totalCount;
		},
		
		assignMapToggle (state, obj) {				
			state.toggleMap = obj;
    	},   	
		
		assignCityOrZip (state, obj) {	
			state.latitude = obj.lat;
			state.longitude = obj.lng;
		},    	

		assignCityName (state, obj) {				
			state.cityName = obj;
    	},   	  		

		assignLocations (state, obj) {		
			const newCollection = [];
			for (const location of obj ) {
						
				newCollection.push( new Location(location))
			}

			state.locations = newCollection;
		},			

		assignLocationType (state, obj) {				
			state.locationType = obj;
		},    	
		
		assignLocationName (state, obj) {			
			state.locationName = obj;
    	},    			

		assignSort (state, obj) {				
			state.longitude = obj;
		},   
		
		assignCurrentPage (state, obj) {				
			state.currentPage = obj;
		},    		

		assignPediatric (state, obj) {				
			state.childrenOnly = obj;
		},    
		
		assignUrlQuery (state, obj) {
			state.urlQuery = obj
		},		
		
		/**
		 * Sets query params
		 * 
		 * @param {*} state 
		 * @param {*} obj 
		 */
		setGlobalQuery (state, obj) {
			/**
			 * Remove Any duplicate items that match the new object
			 */
			state.GlobalQuery.QueryParams = state.GlobalQuery.QueryParams.filter(e => e.Field !== obj.Field);			

			/**
			 * Add new object to array
			 */
			state.GlobalQuery.QueryParams.push(obj);			
		},
		
		clearGlobalQuery(state, obj) {
			/**
			 * Remove Any duplicate items that match the new object
			 */
			state.GlobalQuery.QueryParams = state.GlobalQuery.QueryParams.filter(e => e.Field !== obj.Field);			
			// state.GlobalQuery.QueryParams.splice()
			//console.dir(state.GlobalQuery.QueryParams)
			// console.dir(obj)
			/**
			 * Add new object to array
			 */
			state.GlobalQuery.QueryParams.push(obj);					
		}
	},

	/**
	Actions dispatched from our applications are captured here
	*/
	actions : {	

		async AssignClearAll({commit}, payload) {
			commit('assignClearAll', payload);
		},
		/**
		 * 
		 * @param {*} param0 
		 * @param {*} payload 
		 */
		async AssignPathname ({commit}, payload) {
			commit('assignPathname', payload);
		},

		/**
		 * Adds Sort by object to state
		 * @param {commit} context 
		 * @param {*} payload 
		 */
		async AssignSortByObject ({commit}, payload) {
			commit('assignSortByObject', payload)
		},

		/**
		 * Adds Location type object to state
		 * @param {commit} context 
		 * @param {*} payload 
		 */
		async AssignLocationTypeObject ({commit}, payload) {
			commit('assignLocationTypeObject', payload)
		},		

		/**
		 * Adds location results total
		 * 
		 * @param {commit} context 
		 * @param {*} payload 
		 */
		async AssignResultsTotal({commit}, payload) {
			commit('assignResultsTotal', payload)
		},	

		/**
		 * Adds Map view Toggle
		 * 
		 * @param {commit} context 
		 * @param {*} payload 
		 */
		async AssignMapToggle({commit}, payload) {
			commit('assignMapToggle', payload)
		},	
		
		/**
		 * Adds City to State (lng/lat)
		 * 
		 * @param {commit} context 
		 * @param {*} payload 
		 */
		async AssignCityOrZip({commit}, payload) {
			commit('assignCityOrZip', payload)
		},		

		/**
		 * Adds City Name to State (string value)
		 * 
		 * @param {commit} context 
		 * @param {*} payload 
		 */
		async AssignCityName({commit}, payload) {
			commit('assignCityName', payload)
		},					
		
		/**
		 * Adds Location Name to State
		 * 
		 * @param {commit} context 
		 * @param {*} payload 
		 */
		async AssignLocationName({commit}, payload) {
			commit('assignLocationName', payload)
		},				
		
		/**
		 * Adds Location Type to State
		 * 
		 * @param {commit} context 
		 * @param {*} payload 
		 */
		async AssignLocationType({commit}, payload) {
			commit('assignLocationType', payload)
		},				

		/**
		 * Adds Sort to State
		 * 
		 * @param {commit} context 
		 * @param {*} payload 
		 */
		async AssignSort({commit}, payload) {
			commit('assignSort', payload)
		},			
		
		/**
		 * Adds Page number to State
		 * 
		 * @param {commit} context 
		 * @param {*} payload 
		 */			
		async AssignPage({commit}, payload) {
			commit('assignCurrentPage', payload)
		},		

		/**
		 * Adds query state
		 * 
		 * @param {commit} context 
		 * @param {*} payload 
		 */
		async AddGlobalQuery({commit}, payload) {
			commit('setGlobalQuery', payload)
		},	
		
		/**
		 * Clears global query/state
		 * 
		 * @param {*} param0 
		 * @param {*} payload 
		 */
		async ClearGlobalQuery({commit}, payload) {
			commit('clearGlobalQuery', payload)
		},	

		/**
		 * 
		 * @param {commit} context 
		 * @param {String} payload 
		 */
		async AddUrlQuery({commit}, payload) {
			commit('assignUrlQuery', payload)
		},
				

		/**
		 * Adds query state
		 * 
		 * @param {commit} context 
		 * @param {*} payload 
		 */
		async AssignPediatric({commit}, payload) {
			commit('assignPediatric', payload)
		},		

		/**
		 * Global request for data. All roads lead to Rome. 
		 * This is Rome!
		 * 
		 * @param {commit} context 
		 * @param {*} payload 
		 */
		async PostData({commit}, payload) {		

			let locations;
			let summary;

			try {
				let response = await Services.getLocations(payload);			
				locations = response.data.Locations;	
				summary = response.data.Summary;

				/**
				 * We update out locations state item with the new array from
				 * the API.
				 */
				commit('assignLocations', locations);

				/**
				 * Update our locationResultsTotal count from the results
				 */

				 commit('assignResultsTotal', summary);

				/**
				 * Initializes the global clear all filters functionality
				 */
				 commit('assignClearAll', false);
	
			} catch (e) {
				// commit('assignResultsTotal', 0);
			}									
		}			
	}
	
})