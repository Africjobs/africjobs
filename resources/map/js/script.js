var geocoder;
var marker;
var chartBase = 'https://chart.googleapis.com/chart?chst=';

function getCountry(results) {
    var geocoderAddressComponent, addressComponentTypes, address;
    for (var i in results) {
        geocoderAddressComponent = results[i].address_components;
        for (var j in geocoderAddressComponent) {
            address = geocoderAddressComponent[j];
            addressComponentTypes = geocoderAddressComponent[j].types;
            for (var k in addressComponentTypes) {
                if (addressComponentTypes[k] == 'country') {
                    return address;
                }
            }
        }
    }
    return 'Unknown';
}

function getCountryIcon(country) {
    return chartBase + 'd_simple_text_icon_left&chld=' +
        escape(country.long_name) + '|14|999|flag_' +
        country.short_name.toLowerCase() + '|24|000|FFF';
}

function getMsgIcon(msg) {
    return chartBase + 'd_bubble_text_small&chld=edge_bl|' + msg +
        '|C6EF8C|000000';
}


var removelist = [];

var bannedcountries = ["CC", "CX", "PG", "FM", "GU", "MP", "PH", "TW", "MO", "HK", "MM", "BD", "IN", "CL", "PY", "BO", "BR", "EC", "CO", "VE", "TT", "AW", "HT", "TC", "MX", "BZ", "GT", "TT", "PA", "CR", "NI", "SV", "HN", "GT", "BZ", "PM", "IE", "GB", "LT", "EE", "SE", "FI", "FO", "IS", "RU", "MN", "KZ", "UY", "AR", "PE", "FK", "SR", "GY", "GD", "BB", "VC", "MQ", "MQ", "DM", "GP", "KN", "AI", "PR", "PR", "DO", "JM", "KY", "CU", "BS", "BM", "US", "CA", "GF", "LC", "MS", "MS", "VI", "VG", "AU", "NZ", "NC", "VU", "SB", "NR", "KI", "MH", "CK", "NU", "TO", "AS", "WS", "TK", "PF", "UM", "JP", "KR", "KP", "CN", "BT", "KG", "TJ", "UZ", "TM", "AF", "PK", "AG", "NP", "NF", "FJ", "WF", "TV", "BN", "MY", "SG", "KH", "VN", "LA", "TH", "NP", "PT", "ES", "FR", "AD", "MC", "AT", "CZ", "DE", "LU", "BE", "NL", "LV", "GL", "AZ", "AM", "GE", "SA", "GR", "AL", "ME", "BA", "RS", "HR", "VA", "IT", "SM", "LI", "CH"];



function initialize() {
    // created using http://gmaps-samples-v3.googlecode.com/svn/trunk/styledmaps/wizard/index.html
    var me = this;
    me.markerList = [];


    var styleOff = [{
        visibility: 'off'
    }];
    var stylez = [{
        featureType: 'administrative',
        elementType: 'labels',
        stylers: styleOff
    }, {
        featureType: 'administrative.province',
        stylers: styleOff
    }, {
        featureType: 'administrative.locality',
        stylers: styleOff
    }, {
        featureType: 'administrative.neighborhood',
        stylers: styleOff
    }, {
        featureType: 'administrative.land_parcel',
        stylers: styleOff
    }, {
        featureType: 'poi',
        stylers: styleOff
    }, {
        featureType: 'landscape',
        stylers: styleOff
    }, {
        featureType: 'road',
        stylers: styleOff
    }, {
        "featureType": "water",
        "stylers": [{
            "hue": "#A9845A"
        }, {
            "color": "#A9845A"
        }, {
            "visibility": "on"
        }]
    }, {
        "featureType": "landscape.natural",
        "stylers": [{
            "color": "#FFffff"
        }, {
            "visibility": "on"
        }]
    }];
    geocoder = new google.maps.Geocoder();
    var mapDiv = document.getElementById('map_canvas');
    var map = new google.maps.Map(mapDiv, {
        center: new google.maps.LatLng(-8.928487, 38.496094),
        zoom: 3,
        mapTypeId: 'Border View',
        draggableCursor: 'pointer',
        draggingCursor: 'wait',
        mapTypeControlOptions: {
            mapTypeIds: ['Border View']
        }
    });
    var customMapType = new google.maps.StyledMapType(stylez, {
        name: 'Border View'
    });
    map.mapTypes.set('Border View', customMapType);

    me.makeInfoWindowEvent = function (map, infowindow, contentString, marker) {

        //Opens the marker
        google.maps.event.addListener(marker, 'mouseover', function () {
            infowindow.setContent(contentString);
            infowindow.open(map, marker);
        });

        //Close the marker on when mouse leaves
        google.maps.event.addListener(marker, 'mouseout', function () {
            infowindow.close(map, marker);
        });
    }

    me.infowindow = new InfoBox({
        shadowStyle: 1,
        padding: 0,
        backgroundColor: 'rgb(57,57,57)',
        borderRadius: 4,
        arrowSize: 10,
        borderWidth: 1,
        minWidth: '450px',
        borderColor: '#2c2c2c',
        disableAutoPan: true,
        hideCloseButton: true,
        arrowPosition: 30,
        arrowStyle: 2
    });

    me.createFlagBox = function (country_detail) {
        var container = $('#countrylist');
        var flag_path = 'images/flags/' + country_detail.country_code.toLowerCase() + '.png';
        //var flag_path = 'http://commons.wikimedia.org/wiki/File%3AFlag_of_' + country_detail.country +'.svg/200px-Flag_of_'+ country_detail +'.svg.png';
        console.log(flag_path);
        var imagemarkup = '<img src="' + flag_path + '"/>';
        var markup = '<li><div class="img-wrapper">' + imagemarkup + '</div></li>';

        container.append(markup);
    }

    me.addMarker = function (country_detail) {

        //Icons
        //var flag_path = 'http://mrsunshyne.github.io/demo/world-countries-resource/flags/' + country_detail.country_code.toLowerCase() + '.gif';
        //var flag_path = 'http://flagpedia.net/data/flags/mini/' + country_detail.country_code.toLowerCase() + '.png';
        //var flag_path =  'big_flags/' +country_detail.country.toLowerCase().replace(' ', '_') + '.gif';
        var flag_path = 'images/flags/' + country_detail.country_code.toLowerCase() + '.png';

        console.log(flag_path);


        var scaleFactor = 1;


        me.markerList[country_detail.country_code] = new google.maps.Marker({
            position: new google.maps.LatLng(country_detail.latitude, country_detail.longitude),
            icon: new google.maps.MarkerImage(
                flag_path //, // my 16x48 sprite with 3 circular icons
                //new google.maps.Size(16*scaleFactor, 16*scaleFactor) // desired size
            ),
            title: '', //country_detail.country,
            countrycode: country_detail.country_code,
            url: 'http://google.com?q=country+code+' + country_detail.country_code,
            map: map
        });

        var info_content = '<div class="afjinfobox" style="200px;"><h2 style="margin-top:0;">' + country_detail.country + '</h2><img src="' + flag_path + '" /><p><strong>' + country_detail.phone_code + '</strong> Jobs available </br> Click the flag to view all the jobs in ' + country_detail.country + '</p></div>';

        //Define pop up.
        makeInfoWindowEvent(map, me.infowindow, info_content, me.markerList[country_detail.country_code]);


        //Click Event on the flags
        google.maps.event.addListener(me.markerList[country_detail.country_code], 'click', function () {
            //removelist.push(this.countrycode);
            //console.log(removelist);
        });

        google.maps.event.addListener(map, "click", function (overlay, latLng) {
            // display the lat/lng in your form's lat/lng fields
            console.log(latLng.lat(), latLng.lng());
        });
    }

    var country_list = countries_list;

    //Add the country flags



    for (i = 0; i < country_list.length; i++) {
        if (country_list[i].region == 'Africa' || country_list[i].region == 'Middle East') {
            me.addMarker(country_list[i]);
            //me.createFlagBox(country_list[i]);
        }
    }

    // marker = new google.maps.Marker({
    //     position : new google.maps.LatLng(53.012924,18.59848),
    //     map      : map
    // });

}

google.maps.event.addDomListener(window, 'load', initialize);

function hh() {
    $('.land').hover(function () {
        $(this).css('fill', '#EA0006').find('path').css('fill', '#EA0006');
    }, function () {
        $(this).css('fill', '#E0E0E0').find('path').css('fill', '#E0E0E0');;
    });

    $('.land').click(function () {
        alert($(this).attr('id'));
    })
}