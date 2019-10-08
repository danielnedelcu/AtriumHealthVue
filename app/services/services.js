import Api from './api'
import GoogleApi from './googleGeocode'


/**
 * API abstraction for all services used in the application
 */
export default {

    /**
     * API for retrieving location data
     * 
     * @type GET
     * @param {*} params 
     */
    getLocations (params){        
        return Api().get('/LocationSearch' + params);    
    },

    /**
     * API for geocoding location data
     * 
     * @type GET
     * @param {*} params 
     */
    getGeocoding (params){       
        return GoogleApi().get(params + '&key=AIzaSyAFbqqaCkjS0dAuAMMDLrvoH1DXAS8E6vQ');    
    },    

}