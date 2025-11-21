

/* MAP js code from documentation */

maptilersdk.config.apiKey = mapToken;  //access from ejs file 


var monument = coordinates;
var map = new maptilersdk.Map({
    container: 'map',
    style: maptilersdk.MapStyle.STREETS,
    center: monument,
    zoom: 15,
    
});

// create the popup
var popup = new maptilersdk.Popup({ offset: 25 }).setText(
    'Exact location provided after booking.'
);

// create DOM element for the marker
var el = document.createElement('div');
el.id = 'marker';

// create the marker
new maptilersdk.Marker({element: el})
    .setLngLat(monument)
    .setPopup(popup) // sets a popup on this marker
    .addTo(map);




