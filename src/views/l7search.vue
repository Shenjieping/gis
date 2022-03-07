<template>
  <div class="l7search">
    <div id="gis" />
  </div>
</template>

<script>
/**
 * @file l7search.vue
 * @author shenjieping@techstar.com.cn
 * @data 2022-01-10 16:37:51
 */
import { Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
const AMap = window.AMap;
export default {
  name: 'L7search',
  data () {
    return {};
  },
  mounted () {
    // this.createSence();
    this.createAmap();
  },
  methods: {
    createSence () {
      const L7AMap = new GaodeMap({
        pitch: 22,
        style: 'dark',
        center: [104.288144, 31.239692],
        zoom: 4.4,
        minZoom: 4,
        token: 'xxxx - token',
        plugin: ['AMap.DistrictSearch', 'AMap.ToolBar'], // 可以不设置
      });
      const scene = new Scene({
        id: 'gis',
        map: L7AMap
      });
      const opts = {
        subdistrict: 0,
        extensions: 'all',
        level: 'city'
      };
      scene.on('loaded', () => {
        const plugin = new window.AMap['ToolBar']();
        const map = scene.map;
        map.addControl(plugin);

        const district = new window.AMap['DistrictSearch'](opts);
        district.search('北京市', function (status, result) {
          console.log('shenjp==>>.....');

        });
        // const map = scene.map;
        map.addControl(district);
      });
      
    },
    createAmap () {
      var opts = {
        subdistrict: 0,
        extensions: 'all',
        level: 'city'
      };
      console.log('shenjp==>>...', AMap);
      //利用行政区查询获取边界构建mask路径
      //也可以直接通过经纬度构建mask路径
      var district = new AMap.DistrictSearch(opts);
      district.search('北京市', function (status, result) {
        var bounds = result.districtList[0].boundaries;
        var mask = [];
        for(var i =0;i<bounds.length;i+=1){
          mask.push([bounds[i]]);
        }
        var map = new AMap.Map('gis', {
          mask:mask,
          center:[116.472804,39.995725],
          viewMode:'3D',
          showLabel:false,
          labelzIndex:130,
          pitch:40,
          zoom:9,
          layers:[
            new AMap.TileLayer.RoadNet({
              //rejectMapMask:true
            }),
            new AMap.TileLayer.Satellite()
          ]
        });
        var maskerIn = new AMap.Marker({
          position:[116.501415,39.926055],
          map:map
        });
        var maskerOut = new AMap.Marker({//区域外的不会显示
          position:[117.001415,39.926055],
          map:map
        });
        //添加描边
        for(let i =0;i<bounds.length;i+=1){
          new AMap.Polyline({
            path:bounds[i],
            strokeColor:'#99ffff',
            strokeWeight:4,
            map:map
          });
        }
      });
    }
  }
};
</script>

<style lang="scss">
.l7search {
  #gis {
    height: 500px;
    width: 800px;
    position: relative;
  }
}
</style>
