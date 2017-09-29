var model = ko.observableArray([
    {
        geometry: {
            location: {
                lat: -33.87036190000001,
                lng: 151.1978505
            }
        },
        name: "The Little Snail Restaurant"
    },
    {
        geometry: {
            location: {
                lat: -33.867567,
                lng: 151.193742
            }
        },
        name: "Blue Eye Dragon"
    },
    {
        geometry: {
            location: {
                lat: -33.863403,
                lng: 151.19458
            }
        },
        name: "Cafe Morso"
    },
    {
        geometry: {
            location: {
                lat: -33.86799999999999,
                lng: 151.195
            }
        },
        name: "Lobby Lounge"
    },
    {
        geometry: {
            location: {
                lat: -33.8679724,
                lng: 151.1952317
            }
        },
        name: "The Star"
    },
    {
        geometry: {
            location: {
                lat: -33.86479,
                lng: 151.194134
            }
        },
        name: "Doltone House - Jones Bay Wharf"
    },
    {
        geometry: {
            location: {
                lat: -33.862764,
                lng: 151.195186
            }
        },
        name: "Flying Fish Restaurant & Bar"
    },
    {
        geometry: {
            location: {
                lat: -33.866649,
                lng: 151.195766
            }
        },
        name: "Doltone House"
    },
    {
        geometry: {
            location: {
                lat: -33.86887470000001,
                lng: 151.1955128
            }
        },
        name: "Flying Fish & Chips"
    },
    {
        geometry: {
            location: {
                lat: -33.87089549999999,
                lng: 151.1947888
            }
        },
        name: "Crust Gourmet Pizza Bar"
    },
    {
        geometry: {
            location: {
                lat: -33.86679699999999,
                lng: 151.1973652
            }
        },
        name: "LuMi Bar & Dining"
    },
    {
        geometry: {
            location: {
                lat: -33.8683385,
                lng: 151.1954624
            }
        },
        name: "Adriano Zumbo at the Star"
    },
    {
        geometry: {
            location: {
                lat: -33.86941039999999,
                lng: 151.1947572
            }
        },
        name: "Bar Croatia"
    },
    {
        geometry: {
            location: {
                lat: -33.8667062,
                lng: 151.1957844
            }
        },
        name: "Biaggio Cafe"
    },
    {
        geometry: {
            location: {
                lat: -33.869482,
                lng: 151.19551
            }
        },
        name: "Sokyo"
    },
    {
        geometry: {
            location: {
                lat: -33.86815199999999,
                lng: 151.1949404
            }
        },
        name: "Gelato Messina - Pyrmont"
    },
    {
        geometry: {
            location: {
                lat: -33.8695812,
                lng: 151.1959196
            }
        },
        name: "Momofuku Seiōbo"
    },
    {
        geometry: {
            location: {
                lat: -33.867548,
                lng: 151.192403
            }
        },
        name: "Pyrmont Point Hotel"
    },
    {
        geometry: {
            location: {
                lat: -33.8687827,
                lng: 151.197483
            }
        },
        name: "NurMuhammad Restaurant"
    },
    {
        geometry: {
            location: {
                lat: -33.8686392,
                lng: 151.1950674
            }
        },
        name: "Harvest Buffet"
    }
]);
var markerArray = [];
var map;

var viewModel = function () {
    var self = this;
    self.filter = ko.observable("");
    // Function to filter the list
    self.model = ko.computed(function () {
        var searchTerm = self.filter().toLowerCase();
        if (!searchTerm) {
            return model();
        } else {
            return ko.utils.arrayFilter(model(), function (item) {
                return item.name.toLowerCase().indexOf(searchTerm) >= 0;
            });
        }
    });
    //Function to display the filtered items on  the list
    self.model.subscribe(function () {
        // Function To Remove the marker from the map
        for (var i = 0; i < markerArray.length; i++) {
            markerArray[i].setMap(null);
        }
        showMarkers(self.model);
    });
};
ko.applyBindings(new viewModel());


//Function to set animation when a marker or the list is clicked
function bounce(index) {
    var mark = markerArray[index];

    google.maps.event.trigger(mark, 'click');
}

//Inital function to load the map
function initMap(markData) {

    var myLatLng = {lat: -33.8670, lng: 151.1957};
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 16,
        center: myLatLng
    });
    showMarkers(model);
}

//Function to Display the markers on the Map according to the Location
function showMarkers(model) {
    markerArray = [];

    for (var i = 0; i < model().length; i++) {
        var lat = model()[i].geometry.location.lat;
        var lon = model()[i].geometry.location.lng;
        var marker = new google.maps.Marker({
            position: {lat: lat, lng: lon},
            map: map,
            animation: google.maps.Animation.DROP,
            title: model()[i].name
        });
        markerArray.push(marker);
        showInfoWindow(marker, lat, lon);

    }

}

function showInfoWindow(marker, lat, lon) {
    var infoWindow = new google.maps.InfoWindow();

    google.maps.event.addListener(marker, 'click', (function (marker) {

        return function () {
            //Foursquare API call

            clientID = "1GKYWFDMBI5H2GKTFMPINOJYQUNWNMEBNURWZF1MNQMIUAMD";
            clientSecret = "XKOSSPTQGZM5AIGDW5FZ5RI0B2AXQKOEAVQ1X11PYQ5IWM3M";

            var foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll=' + lat + ',' + lon + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20160118&limit=10&llAcc=1000' + '&query=' + marker.title;

            $.ajax({
                url: foursquareURL,
                dataType: 'json',
                success: function (addr) {
                    var address = addr.response.venues[0].location.formattedAddress[0];
                    var infoWindowContent =
                        '<div class="info_content">' +
                        '<h3 >' + marker.title + '</h3>' +
                        '<p>' + address + '</p>' + '</div>';
                    infoWindow.setContent(infoWindowContent);
                    infoWindow.open(map, marker);
                },
                error: function (request, status, error) {
                    alert("Endpoint not Found");
                }
            });
            if (marker.getAnimation() !== null) {
                marker.setAnimation(null);
            } else {
                marker.setAnimation(google.maps.Animation.BOUNCE);
            }
            setTimeout(function () {
                marker.setAnimation(null);
                infoWindow.close();
            }, 1700);
        };
    })(marker));

}

function errorHandler() {
    alert("Please check your internet connection. Maps failed to load");
}