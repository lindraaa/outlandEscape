mapboxgl.accessToken = maptoken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 10, // starting zoom
});
map.addControl(new mapboxgl.NavigationControl())


new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .addTo(map)