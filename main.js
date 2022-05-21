/*
 * @Descripttion: 
 * @version: 
 * @Author: Qi Baoye
 * @Date: 2022-05-15 09:48:33
 * @LastEditors: Qi Baoye
 * @LastEditTime: 2022-05-19 18:48:44
 */




var map = L.map('map', {
    center: [39.90,116.38],
    zoom: 11,
    attributionControl:false 
    // layers: [grayscale, cities]
});



var baseLayers = {
    'satellites': L.tileLayer('https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYXJpY2hhIiwiYSI6ImNrZTdqbWo2ZjFuZnIzNW80cW5mY3hic28ifQ.lwwOhC18IW8SBzqUqOAhWQ', {
        maxZoom: 18,
        attribution:"Sputnik Layer"
    }),

    "CartoDB Positron": L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        maxZoom: 18
    }),

    "OSM": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map),

    "高德": L.tileLayer('http://wprd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}', {
        maxZoom: 18
    })
};

var layerControl = L.control.layers(baseLayers, {}, {
    position: 'topright',
    collapsed: true
}).addTo(map);


// http://localhost:8080/geoserver/ucas/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ucas%3Abj_hs_pois&maxFeatures=50&outputFormat=application%2Fjson


// local data geojson-sample.js
// ---------------------
var geojson = L.geoJson(geojsonSample, {

    style: function (feature) {
        return {color: feature.properties.color};
    },

    onEachFeature: function (feature, layer) {
        var popupText = 'address: ' + feature.properties.poi_addres;

        if (feature.properties.color) {
            popupText += '<br/>color: ' + feature.properties.color;
        }

        layer.bindPopup(popupText);
    }
});
var markers = L.markerClusterGroup({ chunkedLoading: true  });
markers.addLayer(geojson);

map.addLayer(markers);


//  geosever temcat
// ---------------------

// var hs_points = loadWFS("ucas:bj_hs_pois", "EPSG:4326");
// console.log($("#map"));
// console.log(hs_points);
// // var markers = L.markerClusterGroup({ chunkedLoading: true ,icon: myIcon });
// var markers = L.markerClusterGroup({ chunkedLoading: true  });
// function loadWFS(layerName, epsg) {
//     var hs_points = null
//     var urlString = "http://localhost:8080/geoserver/ucas/ows";
//     var param = {
//         service: 'WFS',
//         version: '1.0',
//         request: 'GetFeature',
//         typeName: layerName,
//         outputFormat: 'application/json',
//         maxFeatures:10000,
//         srsName: epsg
//     };
//     var u = urlString + L.Util.getParamString(param, urlString);
    
//     console.log(u);          
//     $.ajax({
//         url:u,
//         async:false,
//         dataType: 'json',
//         // success: loadWfsHandler(data),
//         success:function (data){
//             console.log(data);
//             hs_points = data;
//         }

//         });

//         $.ajax({
//             url:u,
//             dataType: 'json',
//             // success: loadWfsHandler(data),
//             success:function (data){
//                 console.log(data);
//                 hs_points = data;
//                 layer = L.geoJson(data, {
//                     pointToLayer: function (feature, latlng) {
//                         var title = feature.properties.poi_addres;
//                         var marker = L.marker(L.latLng(feature.properties.poi_lat, feature.properties.poi_lon));
//                         // console.log([feature.properties.poi_lat,feature.properties.poi_lon])
//                         marker.bindPopup(title);
//                         markers.addLayer(marker);
//                         markers.refreshClusters(marker)
//                     }
//                 })
//             }
    
//             });
//     return hs_points

// }




