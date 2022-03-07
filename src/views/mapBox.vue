<template>
  <div class="mapBox">
    <div id="marker" />
  </div>
</template>

<script>
import { Scene, Marker, MarkerLayer } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';
export default {
  name: 'MapBox',
  data () {
    return {};
  },
  mounted () {
    this.initMap();
  },
  methods: {
    initMap () {
      const map = new Mapbox({
        token: 'pk.eyJ1Ijoic2hlbmppZXBpbmciLCJhIjoiY2t5czFpcGx3MHN2aDJ3dGdwdHJtb2R3eCJ9.oCwxzWDh5-t8Xrn-AGVxew',
        pitch: 46,
        style: 'dark',
        center: [ 105.790327, 30 ],
        zoom: 4.1,
        // style: 'mapbox://styles/mapbox/light-v10'
        style: {
          "version": 8,
          "name": "Mapbox Streets",
          "sprite": "mapbox://sprites/mapbox/streets-v8",
          "glyphs": "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
          sources: {
            'wms-test-source': {
              'type': 'raster',
              // use the tiles option to specify a WMS tile source URL
              // https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/
              'tiles': [
              // 'https://img.nj.gov/imagerywms/Natural2015?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=Natural2015',
                // '172.16.207.254:8099/geoserver/gwc/service/wmts?layer=zhuhai:zhuhaitif&style=&tilematrixset=My_GlobalCRS84Pixel&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/png&TileMatrix=GlobalCRS84Pixel:12&TileCol=515&TileRow=119',
                // 'http://172.16.207.254:8099/geoserver/gwc/service/wmts?layer=zhuhai:zhuhaitif&style=&tilematrixset=My_GlobalCRS84Pixel&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/png&TileMatrix=GlobalCRS84Pixel:5&TileCol=27&TileRow=9',
                // 'http://172.16.207.254:8099/geoserver/gwc/service/wmts?layer=zhuhai:zhuhaitif&style=&tilematrixset=My_GlobalCRS84Pixel&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/png&TileMatrix=GlobalCRS84Pixel:12&TileCol=515&TileRow=119'
                // 'http://172.16.207.254:8099/geoserver/gwc/service/wmts?layer=zhuhai:zhuhaitif&style=&tilematrixset=My_GlobalCRS84Pixel&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/png&TileMatrix=GlobalCRS84Pixel:{z}&TileCol={x}&TileRow={y}'
                'http://10.21.232.23:50001/proxy/server/0743EECC7D2648E485FF2B551152F66F/25A0E34254A04FCFB2E3276924A03615?layer=zhuhai:zhuhaitif&style=&tilematrixset=My_GlobalCRS84Pixel&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/png&TileMatrix=GlobalCRS84Pixel:{z}&TileCol={x}&TileRow={y}'
              ],
              // 'tileSize': 256
              'tileSize': 2048
            }
          },
          layers: [
            {
              'id': 'wms-test-layer',
              'type': 'raster',
              'source': 'wms-test-source',
              'paint': {
                "raster-opacity": 0.85
              },
              'source-layer': 'osmtiles'
            },
          ]
        }
      });
      const scene = new Scene({
        id: 'marker',
        map
      });
    }
  }
};
</script>

<style lang="scss">
.mapBox {
  position: relative;
  height: 800px;
  width: 800px;
  #marker {
    height: 100%;
    width: 100%;
  }
}
</style>
