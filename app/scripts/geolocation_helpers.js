var IPGeolocationAPI = require('ip-geolocation-api-javascript-sdk');
var ipgeolocationApi = new IPGeolocationAPI("187c98400c534645ae85c3fe15504a12");

var GeolocationParams = require('ip-geolocation-api-javascript-sdk/GeolocationParams.js');

async function getNodeCountryFrequency(ipAddresses){
    var geolocationParams = new GeolocationParams();
    geolocationParams.setLang('en');

    geolocationParams.setFields('country_name');

    locations = {};
    for(var i = 0; i< ipAddresses.length; i++){
        geolocationParams.setIPAddress(ipAddresses[i]);
        var country = await getCountryFromGeolocationParams(geolocationParams);
        if(country !== undefined){
            if(country in locations){
                locations[country]++;
            }else{
                locations[country] = 1;
            }
        }
    }

    return locations;
}

function getCountryFromGeolocationParams(geolocationParams){
    return new Promise(function(resolve, reject){
        ipgeolocationApi.getGeolocation(function(response) {
            console.log("Received response from geolocation api for single ip");
            console.log(response);
            if('country_name' in response){
                resolve(response['country_name']);
            }else{
                resolve(undefined);
            }

        }, geolocationParams)
    });

}

module.exports = {
    getNodeCountryFrequency: getNodeCountryFrequency
};