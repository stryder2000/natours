export const displayMap = locations => {
    mapboxgl.accessToken =
    'pk.eyJ1Ijoic3RyeWRlci0yMDAwIiwiYSI6ImNrY3VjeWUyZDAzN3oyc282dnJzMmt2dmEifQ.ktWxz6ZBKjz69CoVpwAZtA';

    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/stryder-2000/ckcudb5v23o021jnru5mvp67n',
        scrollZoom: false
        //    center: [-118.2437, 34.0522],
        //    zoom: 6
    });

    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach(loc => {
        //Create Marker
        const el = document.createElement('div');
        el.className = 'marker';

        //Add Marker
        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom'
        })
            .setLngLat(loc.coordinates)
            .addTo(map);

        //Add popup
        new mapboxgl.Popup({
            offset: 30
        })
            .setLngLat(loc.coordinates)
            .setHTML(`<p>Day ${loc.day} : ${loc.description}`)
            .addTo(map);

        //Extend map bounds to include current location
        bounds.extend(loc.coordinates);
    });

    map.fitBounds(bounds, {
        padding: {
            top: 200,
            left: 100,
            right: 100,
            bottom: 150
        }
    });
}