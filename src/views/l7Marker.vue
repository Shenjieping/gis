<template>
  <div class="l7Marker">
    <div id="marker" />
    <div class="ratio">juejin</div>
  </div>
</template>

<script>
import { Scene, Marker, MarkerLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
export default {
  name: 'L7Marker',
  data () {
    return {};
  },
  mounted () {
    this.initMap();
  },
  methods: {
    initMap () {
      const scene = new Scene({
        id: 'marker',
        map: new GaodeMap({
          token: '6d257dde97d935d7fa16fcb7383a8cee',
          pitch: 46,
          style: 'dark',
          center: [ 105.790327, 30 ],
          zoom: 4.1
        })
      });
      scene.on('loaded', () => {
        fetch('https://gw.alipayobjects.com/os/basement_prod/67f47049-8787-45fc-acfe-e19924afe032.json')
          .then(res => res.json())
          .then(node => {
            const markerLayer = new MarkerLayer({
              // cluster: true
            });
            node = node.filter(item => item.g === '1' && item.v);
            console.log('shenjp==>>1111', node);
            node.forEach(item => {
              const box = document.createElement('div');
              box.className = 'container';
              box.style.backgroundImage = 'url("https://t7.baidu.com/it/u=1595072465,3644073269&fm=193&f=GIF")';
              const content = `<h1>${item.v}</h1><span>${item.n}</span>`;
              box.innerHTML = content;
              const marker = new Marker({
                element: box
              }).setLnglat({
                lng: item.x * 1,
                lat: item.y
              });
              markerLayer.addMarker(marker);
            });
            scene.addMarkerLayer(markerLayer);
          });
      });
    }
  }
};
</script>

<style lang="scss">
.l7Marker {
  position: relative;
  height: 800px;
  width: 800px;
  #marker {
    height: 100%;
    width: 100%;
    .container {
      border-radius: 100%;
      background-size: 100% 100%;
      height: auto;
      // aspect-ratio: 1/1;
      display: flex !important;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      h1 {
        color: #fbac2b;
        font-size: 18px;
        text-align: center;
        margin: 0;
      }
      span {
        color: #fff;
        font-size: 14px;
      }
      .ratio::before {
        float: left;
        padding-top: 100%;
        content: '';
      }
      .ratio::after {
        display: block;
        content: '';
        clear: both;
      }
    }
  }
  .ratio {
    background-color: #f66;
    width: 200px;
    // aspect-ratio: 1/1;
  }
  .ratio::before {
    float: left;
    padding-top: 100%;
    content: '';
  }
  .ratio::after {
    display: block;
    content: '';
    clear: both;
  }
}
</style>
