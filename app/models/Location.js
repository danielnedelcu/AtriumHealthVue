export default class Location {
    /**
     * Location Class abstraction which provides a wrapper for each
     * location object. Makes updating properties easier by defining
     * complexity here, instead of the template.
     * @param {obj} rawData - JSON representation of each location
     */
    constructor ( rawData = {} ) {   
        this.LocationName = rawData.Name
        this.LocationAddress = rawData.Address
        this.LocationCity = rawData.City
        this.LocationState = rawData.State
        this.LocationPostalCode = rawData.PostalCode
        this.LocationWaitTime = rawData.WaitTime 
		this.WaitTimeMinutes = rawData.Minutes
        this.LocationDistance = rawData.Distance 
        this.LocationPhone = rawData.Phone 
        this.LocationWebsite = rawData.ClickableUri
        this.LocationType = rawData.LocationTypeValue
        this.LocationReservation = rawData.ClockWiseURL
        this.LocationMapUrl = 'http://maps.google.com'
        this.Latitude = rawData.Latitude
        this.Longitude = rawData.Longitude
        this.LocationTreatsChildren = rawData.ChildrensLocation
        this.LocationHours = rawData.HoursToday
		this.LocationHoursDetail = rawData.HoursAdditionalDetails
		this.HasWaitTime = rawData.HasWaitTime
		this.IsLocationClosed = false
    }

    get mapUrl() {
        //return 'https://maps.google.com/maps?hl=en&daddr=' + this.LocationName + ' ' + this.LocationAddress + ' ' + this.LocationCity + ' ' + this.LocationState + ' ' + this.LocationPostalCode 
        return 'https://maps.google.com/maps?hl=en&daddr=' + encodeURI(location.LocationAddress)
    }

    get locationPhone() {
        return 'tel:' + this.LocationPhone
    }

    get locationFullAddress() {
        let fulladdress = this.LocationAddress;
        let cityStateZip = this.LocationCity;

        if (this.LocationState) {
            cityStateZip = cityStateZip + ", " + this.LocationState;
        }

        if (this.LocationPostalCode) {
            cityStateZip = cityStateZip + " " + this.LocationPostalCode;
        }

        if (cityStateZip) {
            fulladdress = fulladdress + "<br/>" + cityStateZip;
        }

        return fulladdress;
    }
}