# 北京核酸检测点查询服务-demo (ucas-webgis)

## github 
点击链接进入项目[demo](https://by-q.github.io/Beijing-nucleic-acid-testing-NAT-/)

## 搭建环境及数据说明
- leaflet 提供地图服务
- Node.js
- 数据来源：爬取由百度地图提供北京市及周边地区的核酸检测点(json格式)

## 插件
- 点的聚散样式：[Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster)
- GPS定位: [Leaflet.AccuratePosition](https://github.com/M165437/Leaflet.AccuratePosition)

## 本地启用
- npm 初始化
```
npm init
```
- 安装liver server 
```
npm i live-server -g
```
- 修改package.json
```
"scripts": {
"server": "live-server ./ --port=8181 --host=localhost --proxy=/api:http://www.abc.com/api/"
}
```
- 启动项目 localhost
```
npm run server
```

- 或者 vscode + Live Server扩展 :Live Server 打开index.html

## 功能介绍
1. part 1   
北京核酸检测点图层显示
![](./Readme-asset/part%201.png)

2. part 2      
真实地理位置定位。点击**定位**后，会加载真实地理位置；需要说明的是，手机定位会更加准确，PC端定位精度较差。所以本demo对手机端和pc端都适用
![](./Readme-asset/part%202.png)
    - PC端定位
    ![](./Readme-asset/part%202-1.png)
    - 手机端定位
    ![](./Readme-asset/part%202-2.jpg)
3. part 3  
- 除真实定位外，也提供了虚拟的的定位作为测试功能。点击**选择**按钮，在地图任意选择位置点击，便会出现虚拟位置坐标;且支持按住鼠标拖动虚拟位置；**清除**按钮会清除虚拟位置； 
- 当前demo只支持对一个虚拟位置进行查询

![](./Readme-asset/part%203.png)
![](./Readme-asset/part%203-1.png)

4. part 4
![](./Readme-asset/part%204.png)
-  真实位置查询，前提获取真实GPS,设置查询半径
![](./Readme-asset/part%204-1.png)
-  虚拟位置查询， 获取虚拟位置坐标，设置查询半径
![](./Readme-asset)
![](./Readme-asset/part%204-2.png)

## 关键源码
1. 数据服务
main.js中提供两种数据加载格式：
```javascript
// 第一种 本地引用geojson-sample.js
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


// 第二种 从geoserver中调用，（搭载在temcat服务器,

var hs_points = loadWFS("ucas:bj_hs_pois", "EPSG:4326");
console.log($("#map"));
console.log(hs_points);
// var markers = L.markerClusterGroup({ chunkedLoading: true ,icon: myIcon });
var markers = L.markerClusterGroup({ chunkedLoading: true  });
function loadWFS(layerName, epsg) {
    var hs_points = null
    var urlString = "http://localhost:8080/geoserver/ucas/ows";
    var param = {
        service: 'WFS',
        version: '1.0',
        request: 'GetFeature',
        typeName: layerName,
        outputFormat: 'application/json',
        maxFeatures:10000,
        srsName: epsg
    };
    var u = urlString + L.Util.getParamString(param, urlString);
    
    console.log(u);          
    $.ajax({
        url:u,
        async:false,
        dataType: 'json',
        // success: loadWfsHandler(data),
        success:function (data){
            console.log(data);
            hs_points = data;
        }

        });

        $.ajax({
            url:u,
            dataType: 'json',
            // success: loadWfsHandler(data),
            success:function (data){
                console.log(data);
                hs_points = data;
                layer = L.geoJson(data, {
                    pointToLayer: function (feature, latlng) {
                        var title = feature.properties.poi_addres;
                        var marker = L.marker(L.latLng(feature.properties.poi_lat, feature.properties.poi_lon));
                        // console.log([feature.properties.poi_lat,feature.properties.poi_lon])
                        marker.bindPopup(title);
                        markers.addLayer(marker);
                        markers.refreshClusters(marker)
                    }
                })
            }
    
            });
    return hs_points

}

```

2. 定位
```javascript
function onAccuratePositionFound (e){
    ...
}
```

3. 虚拟位置
- 检测鼠标活动
```javascript
map.on('mouseup', (e) => {
                virtual_latlng = e.latlng;
                console.log(virtual_latlng);// {lat: 30.59, lng: 114.32}
                Virtual_marker = L.marker(virtual_latlng,{icon: vrIcon,draggable:true,riseOnHover:true,
                title:'虚拟位置（按住鼠标可移动）'}).addTo(map);  
                isVirtualClick = true 
                Virtual_marker_is_null = false
                // console.log(isVirtualClick)

                if (isVirtualClick){
                map.off('mouseup');
                }
    })
```
- 实现鼠标拖动
```javascript
Virtual_marker.on('dragend', function (event) {
                virtual_latlng =Virtual_marker.getLatLng();
                console.log(virtual_latlng);})

```
4. 检索查询
- 提取查询范围内的核酸检测点
```javascript
var isInCircle = circle.getBounds().contains(data)
//  返回bool类别，getBounds()生成一个方形边界，data是geojson
// 返回true后，增加圆形半径判断条件，去除边角的点
let distance = virtual_latlng.distanceTo(data); 
if(distance <= radius.value){
    ...
}
```
