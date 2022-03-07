<template>
  <div class="about">
    <div
      id="map" />
  </div>
</template>

<script>
import { Scene, PolygonLayer, LineLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

export default {
  name: 'VueGisAbout',

  data () {
    return {
      
    };
  },

  mounted () {
    this.initMap();
  },

  methods: {
    initMap () {
      const scene = new Scene({
        id: 'map',
        map: new GaodeMap({
          token: '6d257dde97d935d7fa16fcb7383a8cee',
          pitch: 46,
          style: 'dark',
          center: [ 114.229445, 22.555644 ],
          zoom: 6.1
        })
      });
      scene.on('loaded', () => {
        fetch(
          // 'http://172.16.207.20:6600/vbi/download/1460115910118563840'
          // 'https://gw.alipayobjects.com/os/bmw-prod/d6da7ac1-8b4f-4a55-93ea-e81aa08f0cf3.json'
          // 'https://172.16.207.20:3001/geoJSON.json'
          'https://gw.alipayobjects.com/os/bmw-prod/707cd4be-8ffe-4778-b863-3335eefd5fd5.json',
        )
          .then(res => res.json())
          .then(data => {
            const layer = new PolygonLayer({
              autoFit: false,
              maxZoom: 8,
              minZoom: 2
            })
              .source(data)
              .shape('fill')
              .color('#000')
              .style({
                opacity: 0.5
              });
            const layer2 = new LineLayer({
              zIndex: 2
            })
              .source(data)
              .color('#fff')
              .size(0.5)
              .style({
                opacity: 1
              });
            scene.addLayer(layer);
            scene.addLayer(layer2);
            layer.on('click', (e) => {
              console.log('shenjp==>>', e);
              const { lngLat } = e;
              const { lat, lng } = lngLat;
              scene.setZoomAndCenter(10, [lng, lat]);
            });
          });
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.about {
  width: 900px;
  height: 500px;
  position: relative;
  #map {
    width: 100%;
    height: 100%;
  }
}
</style>