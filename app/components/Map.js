import Vue from 'vue/dist/vue.js';
import { store } from '../store/store.js'
import * as Constants from '../constants/constants'
import VueMixins from "../mixins/mixins"

/**
 * Search results component
 */
export default Vue.component('Map', {
    template: '#MapTemplate',
    store,
    components : {

    },

    data () {
        return {
            infoWindows : [],
            markerData : [],
            map : null,
            icons : {
                minutesPin: {
                    icon: {
                        url: '/Assets/includes/AtriumHealthPlatform/images/atrium-location-pin-with-mins.svg',
                        scaledSize: new google.maps.Size(60, 60),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(0, 0),
                        labelOrigin: new google.maps.Point(30, 22)
                    }
				},
				standardPin: {
					icon: {
						url: '/Assets/includes/AtriumHealthPlatform/images/atrium-location-pin.svg',
                        scaledSize: new google.maps.Size(50, 50),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(0, 0)
					}
				},
				disabledPin: {
					icon: {
						url: '/Assets/includes/AtriumHealthPlatform/images/atrium-location-pin-disabled.svg',
                        scaledSize: new google.maps.Size(50, 50),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(0, 0)
					}
				}
			},
			defaultZoom: 11
        }
    },

    created () {

    },

    mounted () {
        let _self = this;
    
        setTimeout(function() {
            _self.initializeMap();
        }, 1000)
    },

    methods : {
		
		generateOverlayMarkup: function(location) {
			
			let _self = this;
			let result = '<div class="location-info">';

			if (location.LocationName) {
				result += '<div class="location-name">';
				if (location.LocationWebsite) {
					result += '<a href="' + location.LocationWebsite + '">';
				}
				result += location.LocationName;
				if (location.LocationWebsite) {
					result += '</a>';
				}
				result += '</div>';
			}
			
			if (location.LocationType) {
				result += '<div class="location-type"><div class="icon"><i class="fa fa-hospital-o"></i></div>' + location.LocationType + '</div>';
            }
            console.dir(location.LocationReservation);

            if (location.LocationReservation) {
                result += '<div class="location-reservation">' +
                            '<a href="' + location.LocationReservation + '" target="_blank" class="">Reserve your spot</a>' +
                        '</div>';
            }
            

			if (location.LocationAddress) {
				result += '<div class="location-address"><div class="icon"><i class="fa fa-map-marker"></i></div>';
                result += '<a href="https://maps.google.com/maps?hl=en&daddr=' + encodeURI(location.LocationAddress) + '" target="_blank">' + location.locationFullAddress + '</a>';
				result += '</div>';
			}
			
			if (location.LocationTreatsChildren) {
				result += '<div class="location-children"><div class="icon"><img src="/Assets/includes/AtriumHealthPlatform/images/child.svg"></div> Treats children only</div>';
			}
			
			if (location.LocationDistance) {
				result += 	'<div class="location-distance">' +
								'<div class="icon"><i class="fa fa-location-arrow"></i></div>' +
								'Distance ' + location.LocationDistance + ' miles' +
							'</div>';
			}
							
            if (location.LocationWaitTime) {
				result += 	'<div class="location-wait-time">' +
								'<div class="icon"><i class="fa fa-clock-o"></i></div>' +
                                'Walk-in wait time: ' + location.LocationWaitTime +
							'</div>';
			}
			
			if (location.LocationPhone) {
				result += 	'<div class="location-phone">' +
								'<div class="icon"><i class="fa fa-phone"></i></div>' +
								'Phone: <a href="tel:' + location.LocationPhone + '">' + location.LocationPhone + '</a>' +
							'</div>';
			}
			
			result += '</div>';
			return result;
		},
		
        initializeMap () {
            let _self = this;
            
            /**
             * Instantiates the Google Map
             */
            this.map = new google.maps.Map(document.getElementById('map'), { 
                center: new google.maps.LatLng(_self.getLatitude, _self.getLongitude), zoom: _self.defaultZoom 
            });

            this.infowindow = new google.maps.InfoWindow();            

            this.resetMap(_self.getLocations);  
        },

        /**
         * Called each time the locations obj/state changes
         * @param {*} locationObj - locations object
         */
        resetMap (locationObj) {
            let _self = this;            

            if(this.map) {
                /**
                 * Removes any data for the markers array
                 */
                if(this.markerData.length) {
                    for (var i = 0; i < this.markerData.length; i++) {
                        this.markerData[i].setMap(null);
                    }        
                    
                    this.markerData.splice(0, this.markerData.length);
                    this.markerData = [];                    
                }                

                for (let i = 0; i < locationObj.length; i++) {					
                    let pinOption;
                    let wt;
					
					if (_self.getLocations[i].IsLocationClosed) {
						pinOption = _self.icons.disabledPin;
					}
					else if (_self.getLocations[i].HasWaitTime) {
                        pinOption = _self.icons.minutesPin;
                        wt = _self.getLocations[i].WaitTimeMinutes;
					}
					else {
                         pinOption = _self.icons.standardPin;
                         wt = ' ';
					}
					
                    let waitTimeFontSize = '18px';
                    
					if (parseInt(_self.getLocations[i].WaitTimeMinutes) < 15) {
						_self.getLocations[i].WaitTimeMinutes = '<15';
						waitTimeFontSize = '14px';
                    }
                    

                    /**
                     * Google API for plotting markers on map
                     */
                    //following logic is to separate out overlapping pins.  When pins have exact same
                    //geo-cordinates, i am shifting the coordinate by 0.0007 so that the pins are separated out. 
                    for (let innerCtr = 0; innerCtr < i; innerCtr++) {
                        if (locationObj[i].Latitude === locationObj[innerCtr].Latitude &&
                            (locationObj[i].Longitude == locationObj[innerCtr].Longitude)) {

                            locationObj[i].Latitude = locationObj[i].Latitude + 0.0007;
                            //locationObj[i].Longitude = locationObj[i].Longitude + 0.0008;  (shifting only the lat, not the long)
                        }
                    }


                    let marker = new google.maps.Marker({
                        position: new google.maps.LatLng({ lat : locationObj[i].Latitude, lng: locationObj[i].Longitude}),
                        icon: pinOption.icon,
                        map: _self.map,
                        infoWindowContent: 	_self.generateOverlayMarkup(_self.getLocations[i]),
						label: { 
							color: '#fff', 
							fontSize: waitTimeFontSize,
							fontFamily: 'FFBauWebProBold',
                            text: wt.toString()
                        }
                    });
        
                    marker.set('id', i + 1);
                    this.markerData.push(marker);      
                    
                    let infowindow = new google.maps.InfoWindow({
                        content: marker.infoWindowContent
                    });

                    this.infoWindows.push(infowindow);
                    
                    /**
                     * Sets the central focus on the first marker in the array
                     */
                    var mmm = this.markerData[0];
                    var markerPos = mmm.getPosition();
                    //_self.map.setCenter(markerPos);
                    _self.map.setZoom(_self.defaultZoom);

                    marker.addListener('click', function () {
                        _self.closeAllInfoWindows();
                        infowindow.open(_self.map, marker);
                    });
                };                

            }   

        },

        /**
         * Close all infoWindows before you trigger an open();
         */
        closeAllInfoWindows() {
            for (var i=0;i<this.infoWindows.length;i++) {
                this.infoWindows[i].close();
            }            
        }
    },

    watch : {
        /**
         * Listens to any changes to the locations object which gets triggered
         * after every city/zip change.
         * @param {*} obj - locations 
         */
        getLocations (obj) {
            this.resetMap(obj);
        }
    },

    computed : {        
        /**
         * State Object
         */        
        getLocations() {
            return this.$store.getters.getLocations;
        },

        /**
         * State Object
         */        
        getLatitude() {
            return this.$store.getters.getLatitude;
        },

        /**
         * State Object
         */        
        getLongitude() {
            return this.$store.getters.getLongitude;
        },

        /**
         * State Object
         */
        toggle () {
            return this.$store.getters.getToggleMap
        }     
	}
});             
