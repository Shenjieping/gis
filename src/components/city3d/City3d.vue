<template>
  <div id="l7mapwrap">
    <div
      ref="mapContainer"
      class="map-container" />
    <div class="maphandbar-wrap">
      <div class="maphandbar" />
    </div>
  </div>
</template>

<script>
import * as L7 from '@antv/l7';
import { GaodeMap, Mapbox } from '@antv/l7-maps';
// import { WorldLayer } from '@antv/l7-district'
// import axios from 'axios'
// import img1 from '@/assets/vgimg/wewf.jpeg'

import qipao1json from './data/qipao1.json';
import buildingmodeljson from './data/buildingmodel5.geo.json';
import flyline1json from './data/flyline1.json';
import projectinfojson from './data/projectinfo.json';
import { hexify } from './util';
import { markerBgImg } from './data/markerbgimg2';
import { markerData as defaultMarkerData } from './data/marker';
import { DataSet } from '@antv/data-set';

const htsdFeature = {
  type: 'Feature',
  properties: { Name: null, description: null, Height: '100' },
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [116.1924964, 40.0742513],
        [116.1924964, 40.0662513],
        [116.1804964, 40.0662513],
        [116.1804964, 40.0742513],
        [116.1924964, 40.0742513]
      ]
    ]
  }
};
buildingmodeljson.features.push(htsdFeature);

const defaultBuildingModel = {
  version: 111,
  color: '#FF0000',
  heightRate: 1,
  htColor: '#0000FF',
  htHeightRate: 1
};

export default {
  props: ['onMounted'],
  data () {
    return {
      scene: null,
      mapType: '',
      layers: {},
      l7Data: {},
      imageMarkerClick: null
    };
  },

  methods: {
    setL7 (custom, data, cb) {
      console.log('........===...');
      this.imageMarkerClick = cb;
      const styleType = custom.styleType.value;
      const styleUrl = custom.styleUrl.value;
      const themeStyle = styleUrl ? styleUrl : styleType;
      if (!this.scene || this.mapType !== custom.mapType.value
      || this.themeStyle !== themeStyle) {
        this.createScene(custom, data);
      } else {
        this.l7Data = data;
        this.updateL7(custom, data);
      }
    },

    toBeijing () {
      // alert(a)
      // this.currentCustom.center.value = 'bj'
      this.currentCustom.zoom.value = 15;
      this.currentCustom.lng.value = 116.17;
      this.currentCustom.lat.value = 40.07;
      this.currentCustom.pitch.value = 47;
      this.currentCustom.rotate.value = 4;
      this.currentCustom.zhutiDiam.value = 22;
      this.currentCustom.zhutiHeightRate.value = 1.6;
      this.currentCustom.markerCfg.value = JSON.stringify(
        {
          fontSize: '60 30 30 30 30 30',
          position: '-190 40; -10 20; -30 0; -20 40; 0 30; -35 50',
          padding: '70 90; 40 60; 40 60; 40 60; 40 60; 40 60'
        },
        null,
        2
      );
      this.updateL7(this.currentCustom);
    },
    toChina () {
      this.currentCustom.zoom.value = 6;
      this.currentCustom.lng.value = 104;
      this.currentCustom.lat.value = 33;
      this.currentCustom.pitch.value = 39.5;
      this.currentCustom.rotate.value = 9;
      this.currentCustom.zhutiDiam.value = 9;
      this.currentCustom.zhutiHeightRate.value = 1.4;
      this.currentCustom.markerCfg.value = JSON.stringify(
        {
          fontSize: '40 30 30 30 30 30',
          position: '-130 60; -10 20; -30 0; -20 40; 0 30; -35 50',
          padding: '50 60; 40 60; 40 60; 40 60; 40 60; 40 60'
        },
        null,
        2
      );
      this.updateL7(this.currentCustom);
    },
    toYear (year) {
      const curYearInfo = projectinfojson.filter(p => p.year === year);
      this.currentCustom.zhutiData.value = JSON.stringify(curYearInfo, null, 2);
      this.updateL7(this.currentCustom);
    },
    getProps (custom = {}) {
      const mapType = custom.mapType.value || 'gaodemap';
      const zoom = custom.zoom.value || 6;
      const pitch = custom.pitch.value || 39.5;
      const rotate = custom.rotate.value || 9;
      const lng = custom.lng.value || 104;
      const lat = custom.lat.value || 33;
      const center = [lng, lat];
      const qipaoColorRgba = custom.qipaoColor.value;
      const qipaoColor = qipaoColorRgba ? hexify(qipaoColorRgba) : '#abc7e9';
      const qipaoSize = custom.qipaoSize.value || 35;
      const flylineShape = custom.flylineShape.value;
      const flylineSize = custom.flylineSize.value || 2;
      const flylineColorRgba = custom.flylineColor.value;
      const flylineColor = flylineColorRgba ? hexify(flylineColorRgba) : '#ffae67';
      const flylineOpacity = custom.flylineOpacity.value;
      const flylineDuration = custom.flylineDuration.value;
      const flylineInterval = custom.flylineInterval.value;
      const flylineTrail = custom.flylineTrail.value;
      const zhutiColorRgba = custom.zhutiColor.value;
      const zhutiColor = zhutiColorRgba ? hexify(zhutiColorRgba) : '#ffae67';
      const htColorRgba = custom.htColor.value;
      const htColor = htColorRgba ? hexify(htColorRgba) : '#ffae67';
      const zhutiDiam = custom.zhutiDiam.value;
      const zhutiHeightRate = custom.zhutiHeightRate.value;
      // const markerDataStr = custom.markerData && custom.markerData.value.trim()
      // const markerDataInput = markerDataStr ? JSON.parse(markerDataStr) : null
      // const markerData = markerDataInput || defaultMarkerData
      // custom.markerData.value = JSON.stringify(markerData, null, 2)

      const markerData = defaultMarkerData;
      const defautMarkerCfg = {
        fontSize: '20 20 20 20 20 20',
        position: '0 0; 0 0; 0 0; 0 0; 0 0; 0 0',
        padding: '40 60; 40 60; 40 60; 40 60; 40 60; 40 60'
      };
      const markerCfgStr = custom.markerCfg && custom.markerCfg.value.trim();
      const markerCfgStrInput = markerCfgStr ? JSON.parse(markerCfgStr) : null;
      const markerCfg = markerCfgStrInput || defautMarkerCfg;
      custom.markerCfg.value = JSON.stringify(markerCfg, null, 2);

      const buildingModelCfgStr = custom.buildingModelCfg && custom.buildingModelCfg.value.trim();
      const buildingModelCfgInput = buildingModelCfgStr && JSON.parse(buildingModelCfgStr);
      const buildingModelCfg = buildingModelCfgInput || defaultBuildingModel;
      custom.buildingModelCfg.value = JSON.stringify(buildingModelCfg, null, 2);

      const defaultProjectInfoData = projectinfojson.filter(p => p.year === 2020);
      const projectInfoStr = custom.zhutiData && custom.zhutiData.value.trim();
      const projectInfoInput = projectInfoStr ? JSON.parse(projectInfoStr) : null;
      const projectInfoData = projectInfoInput || defaultProjectInfoData;
      custom.zhutiData.value = JSON.stringify(projectInfoData, null, 2);

      return {
        mapType,
        zoom,
        pitch,
        rotate,
        center,
        lng,
        lat,
        qipaoColor,
        qipaoSize,
        flylineShape,
        flylineSize,
        flylineColor,
        flylineOpacity,
        flylineDuration,
        flylineInterval,
        flylineTrail,
        zhutiColor,
        htColor,
        zhutiDiam,
        zhutiHeightRate,
        markerData,
        markerCfg,
        buildingModelCfg,
        // markerPos,
        // markerPadding,
        projectInfoData,
        subcomponents: custom.subcomponents || {}
      };
    },

    createScene (custom) {
      const { mapType, pitch, zoom, rotate, center } = this.getProps(custom);
      const styleType = custom.styleType.value;
      const styleUrl = custom.styleUrl.value;
      const themeStyle = styleUrl ? styleUrl : styleType;
      const mapInst =
        mapType === 'gaodemap'
          ? new GaodeMap({
            token: '87c869fd0ca471bbd643645d31b4c8ba',
            pitch,
            zoom,
            // style: 'dark',
            // style: 'amap://styles/d879339a169fd50209577f44eeecf743',
            style: themeStyle,
            center
          })
          : new Mapbox({
            // token: '87c869fd0ca471bbd643645d31b4c8ba',
            pitch,
            zoom,
            style: 'dark',
            center
          });
      const scene = new L7.Scene({
        logoVisible: false,
        id: this.$refs.mapContainer,
        map: mapInst
      });
      this.mapType = mapType;
      this.scene = scene;
      this.themeStyle = themeStyle;
      scene.on('loaded', () => {
        this.updateL7(custom);
      });
    },

    updateL7 (custom) {
      console.log('subcomponents.value1111', custom, this.l7Data);
      const data = this.l7Data;
      this.currentCustom = custom;

      const { zoom, pitch, rotate, center, markerData, projectInfoData, subcomponents } = this.getProps(custom);

      this.scene.setZoom(zoom + 1);
      this.scene.setPitch(pitch);
      this.scene.setRotation(rotate);
      this.scene.setCenter(center);
      const _this = this;


      for (let v of subcomponents.value) {
        const type = v.type;
        let component;
        let isNew = false;
        let popup;

        const rows0 = data && v.id === data.qbid && data.rows && data.rows[0];
        const rows1 = data && v.id === data.qbid && data.rows && data.rows[1];
        const rows2 = data && v.id === data.qbid && data.values && data.values[0];
        const rows3 = data && v.id === data.qbid && data.values && data.values[1];

        const lng1Values = rows0 && rows0.values;
        const lat1Values = rows1 && rows1.values;
        const lng2Values = rows2 && rows2.values;
        const lat2Values = rows3 && rows3.values;
        const values = data && v.id === data.qbid && data.values && data.values[0].values;

        if (type === 'bubble') {
          let dataSrc = (this.layers[v.id] && this.layers[v.id].dataSrc) || qipao1json;
          if (lng1Values) {
            dataSrc = [];
            lng1Values.forEach((lng1, idx) => {
              dataSrc.push({
                longitude: lng1,
                latitude: lat1Values[idx],
                count: values[idx]
              });
            });
          }

          if (!this.layers[v.id]) {
            component = new L7.PointLayer({ name: v.id, zIndex: v.custom.zIndex.value });
            component.source(dataSrc, {
              parser: {
                type: 'json',
                x: 'longitude',
                y: 'latitude'
              }
            });
            this.layers[v.id] = {
              value: v,
              component
            };
            isNew = true;
          } else {
            component = this.layers[v.id].component;
            component.setData(dataSrc);
          }
          const qipaoColorRgba = v.custom.color.value;
          const qipaoColor = qipaoColorRgba ? hexify(qipaoColorRgba) : '#abc7e9';
          const qipaoSize = v.custom.size.value || 35;
          const speed = v.custom.speed.value;
          const rings = v.custom.rings.value;
          const isAnimate = v.custom.animate.value;
          component
            .shape('circle')
            .size(qipaoSize)
            .active(true)
            .color(qipaoColor)
            .animate({
              speed: !isAnimate ? 0.00000001 : speed,
              rings
            })
            .style({
              opacity: 1
            });
          if (isNew) {
            this.scene.addLayer(component);
          }
          this.layers[v.id].dataSrc = dataSrc;

          const zIndex = v.custom.zIndex.value;
          const minScale = v.custom.minScale.value;
          const maxScale = v.custom.maxScale.value;
          component.setIndex(zIndex);
          minScale && component.setMinZoom(minScale);
          maxScale && component.setMaxZoom(maxScale);
          v.show ? component.show() : component.hide();
        } else if (type === 'bar3d') {
          const yearInfo = projectInfoData;
          let dataSrc = (this.layers[v.id] && this.layers[v.id].dataSrc) || yearInfo;
          if (lng1Values) {
            dataSrc = [];
            lng1Values.forEach((lng1, idx) => {
              dataSrc.push({
                longitude: lng1,
                latitude: lat1Values[idx],
                count: values[idx]
              });
            });
          }

          if (!this.layers[v.id]) {
            component = new L7.PointLayer({ name: v.id, zIndex: v.custom.zIndex.value });
            component.source(dataSrc, {
              parser: {
                type: 'json',
                x: 'longitude',
                y: 'latitude'
              }
            });
            this.layers[v.id] = {
              value: v,
              component
            };
            isNew = true;
          } else {
            component = this.layers[v.id].component;
            component.setData(dataSrc);
          }
          const zhutiColorRgba = v.custom.zhutiColor.value;
          const zhutiColor = zhutiColorRgba ? hexify(zhutiColorRgba) : '#ffae67';
          const activeColorRgba = v.custom.activeColor.value;
          const activeColor = activeColorRgba ? hexify(activeColorRgba) : '#ffae67';
          const zhutiDiam = v.custom.zhutiDiam.value;
          const zhutiHeightRate = v.custom.zhutiHeightRate.value;
          component
            .active(true)
            .shape(v.custom.shape.value)
            .size('count', h => {
              return [zhutiDiam, zhutiDiam, h * zhutiHeightRate];
            })
            .color(zhutiColor)
            .style({
              opacity: 1.0
            });
          if (isNew) {
            this.scene.addLayer(component);
          }
          this.layers[v.id].dataSrc = dataSrc;
          const zIndex = v.custom.zIndex.value;
          const minScale = v.custom.minScale.value;
          const maxScale = v.custom.maxScale.value;
          component.setIndex(zIndex);
          component.active({ color: activeColor });
          minScale && component.setMinZoom(minScale);
          maxScale && component.setMaxZoom(maxScale);
          v.show ? component.show() : component.hide();
        } else if (type === 'lines') {
          let dataSrc = (this.layers[v.id] && this.layers[v.id].dataSrc) || flyline1json;
          if (lng1Values) {
            dataSrc = [];
            lng1Values.forEach((lng1, idx) => {
              dataSrc.push({
                fromLong: lng1,
                fromLati: lat1Values[idx],
                longitude: lng2Values[idx],
                latitude: lat2Values[idx]
              });
            });
          }
          const zIndex = v.custom.zIndex.value;
          const minScale = v.custom.minScale.value;
          const maxScale = v.custom.maxScale.value;
          const flylineShape = v.custom.shape.value;

          if (!this.layers[v.id]) {
            component = new L7.LineLayer({ name: v.id, zIndex });
            component.shape(flylineShape);
            component.source(dataSrc, {
              parser: {
                type: 'json',
                x: 'fromLong',
                y: 'fromLati',
                x1: 'longitude',
                y1: 'latitude'
              }
            });
            this.layers[v.id] = {
              value: v,
              component
            };
            isNew = true;
          } else {
            component = this.layers[v.id].component;
            component.shape(flylineShape);
            component.setData(dataSrc);
          }

          const flylineSize = v.custom.size.value || 2;
          const flylineColorRgba = v.custom.color.value;
          const flylineColor = flylineColorRgba ? hexify(flylineColorRgba) : '#ffae67';
          const flylineDuration = v.custom.duration.value;
          const flylineInterval = v.custom.interval.value;
          const flylineTrail = v.custom.trail.value;
          const isAnimate = v.custom.animate.value;

          component
            .size(flylineSize)
            .color(flylineColor)
            .animate(isAnimate ? {
              interval: flylineInterval,
              trailLength: flylineTrail,
              duration: flylineDuration
            } : false)
            .style({
              opacity: 1
            });
          if (isNew) {
            this.scene.addLayer(component);
          }
          this.layers[v.id].dataSrc = dataSrc;
          component.setIndex(zIndex);
          minScale && component.setMinZoom(minScale);
          maxScale && component.setMaxZoom(maxScale);
          v.show ? component.show() : component.hide();
        } else if (type === 'marker') {

          if (this.layers[v.id]) {
            component = this.layers[v.id].component;
            component.clear();
            this.scene.removeMarkerLayer(component);
          }
          component = new L7.MarkerLayer({ name: v.id, zIndex: v.custom.zIndex.value });
          this.layers[v.id] = {
            value: v,
            component,
            dataSrc: this.layers[v.id] && this.layers[v.id].dataSrc
          };

          let dataSrc = (this.layers[v.id] && this.layers[v.id].dataSrc) || markerData.data;

          if (lng1Values) {
            dataSrc = [];
            lng1Values.forEach((lng1, idx) => {
              dataSrc.push({
                lng: lng1,
                lat: lat1Values[idx],
                name: values[idx]
              });
            });
          }

          const colorRgba = v.custom.color.value;
          const mkColor = colorRgba ? hexify(colorRgba) : '#FFFFFF';
          const mkSize = v.custom.size.value || 16;
          const mkAnchor = v.custom.anchor.value || 'center';
          const offsetX = v.custom.offsetX.value || 0;
          const offsetY = v.custom.offsetY.value || 0;

          dataSrc.forEach((m, idx) => {
            const elWrap = document.createElement('div');
            const el = document.createElement('div');
            const elText = document.createElement('div');
            elWrap.appendChild(el);
            el.appendChild(elText);

            elWrap.className = 'city3d-marker-wrap';
            el.className = 'city3d-marker';
            elText.className = 'city3d-marker-text';

            elText.textContent = m.name;
            elText.style.fontSize = mkSize + 'px';
            elText.style.color = mkColor;

            component.addMarker(
              new L7.Marker({
                element: elWrap,
                anchor: mkAnchor,
                offsets: [offsetX, offsetY]
              }).setLnglat({ lng: m.lng * 1, lat: m.lat * 1 })
            );
          });

          this.scene.addMarkerLayer(component);
          this.layers[v.id].dataSrc = dataSrc;
          const zIndex = v.custom.zIndex.value;
          const minScale = v.custom.minScale.value;
          const maxScale = v.custom.maxScale.value;
          minScale && component.setMinZoom(minScale);
          maxScale && component.setMaxZoom(maxScale);
        } else if (type === 'imageMarker') {
          const url = v.custom.url.value.url; // 获取图片地址
          if (!url) {
            if (this.scene.getLayerByName(v.id)) {
              this.scene.removeLayer(this.layers[v.id].component);
              this.layers[v.id].url = undefined;
            }
          } else {
            let dataSrc = (this.layers[v.id] && this.layers[v.id].dataSrc) || qipao1json;
            if (lng1Values) {
              dataSrc = [];
              lng1Values.forEach((lng1, idx) => {
                dataSrc.push({
                  longitude: lng1,
                  latitude: lat1Values[idx],
                  count: values[idx],
                  idx
                });
              });
            }
            // debugger
            if (!this.layers[v.id]) {
              // 添加打点图片
              this.scene.addImage(v.id, url);
              // 创建图层
              component = new L7.PointLayer({name: v.id, zIndex: v.custom.zIndex.value});
              component
                .source(dataSrc, {
                  parser: {
                    type: 'json',
                    x: 'longitude',
                    y: 'latitude'
                  }
                })
                .shape(v.id);
              this.layers[v.id] = {
                value: v,
                component
              };
              isNew = true;
            } else {
              component = this.layers[v.id].component;
              component.setData(dataSrc);

            }
            const size = v.custom.size.value;
            const opacity = v.custom.opacity.value;
            component
              .size(size)
              .style({
                opacity
              });
            let showPopup = false; // 防止重复渲染
            const showDialog = v.custom.showDialog.value; // 是否显示弹窗
            const dialogUrl = v.custom.dialogUrl.value.url; // 弹窗背景
            const bgColor = v.custom.bgColor.value; // 弹窗背景
            if (popup) {
              popup.remove();
            }
            // 创建弹窗信息 https://antv-l7.gitee.io/zh/docs/api/component/popup
            popup = new L7.Popup({
              offsets: [0, 40],
              closeButton: false,
              maxWidth: '1000px'
            });
            // 点击出现气泡
            component.on('click', (ev) => {
              if (showPopup || !showDialog) return;
              const { lng, lat } = ev.lngLat || {};
              const { idx } = ev.feature || {};
              const { values } = data || {};
              let htmlInfo = {
                id: '',
                photo: {},
                list: []
              };
              if (values && values.length > 0) {
                htmlInfo.id = values[0].values[idx] || '',
                htmlInfo.photo = {
                  url: values[1].values[idx] || '',
                  name: values[1].code
                };
                htmlInfo.list = values.slice(2).map(item => {
                  return {
                    name: item.code,
                    value: item.values[idx] || ''
                  };
                });
              }
              _this.imageMarkerClick && _this.imageMarkerClick(htmlInfo);
              const html = 
                `<div class="dialog-container" style="background: ${bgColor} ${dialogUrl ? `url(${dialogUrl})` : ''} no-repeat 0 0;">
                  <div class="header">体温异常人员信息</div>
                  <div class="content">
                    <div class="image">
                      <img src="${htmlInfo.photo.url}" />
                    </div>
                    <ul class="info">
                      ${htmlInfo.list.map(item => {
    return `<li class="info-item">
                                <span class="item-title">${item.name}</span>
                                <span class="item-content">${item.value}</span>
                              </li>`;
  })}
                    </ul>
                  </div>
                </div>`;
              showPopup = true;
              popup
                .setLnglat([lng, lat])
                .setHTML(html)
                .open();
            });
            popup.on('close', () => {
              showPopup = false;
            });

            this.scene.addPopup(popup);
            if (isNew) {
              this.scene.addLayer(component);
            }
            v.show ? component.show() : component.hide();
            this.scene.render();
          }
        } else if (type === 'archi3d') {
          const url = v.custom.url.value.url;
          const colorRgba = v.custom.color.value;
          const color = colorRgba ? hexify(colorRgba) : '#816CAD';
          const heightRate = v.custom.heightRate.value;
          if (!url) {
            if (this.scene.getLayerByName(v.id)) {
              this.scene.removeLayer(this.layers[v.id].component);
              this.layers[v.id].url = undefined;
            }
          } else {
            if (
              !this.layers[v.id] ||
              this.layers[v.id].url !== url ||
              this.layers[v.id].color !== color ||
              this.layers[v.id].heightRate !== heightRate
            ) {
              fetch(url)
                .then(res => res.json())
                .then(buildingmodeljson => {
                  let isNew = false;
                  const res = _this.transformGeojson(buildingmodeljson);
                  if (!this.layers[v.id] || !this.scene.getLayerByName(v.id)) {
                    component = new L7.PolygonLayer({
                      name: v.id,
                      zIndex: v.custom.zIndex.value
                    });

                    component.source(res);
                    this.layers[v.id] = {
                      value: v,
                      component,
                      url,
                      color,
                      heightRate
                    };
                    isNew = true;
                  } else {
                    component = this.layers[v.id].component;
                    component.setData(res);
                  }
                  component
                    .shape('extrude')
                    .size('Height', height => {
                      let h;
                      h = parseInt(height);
                      if (!h || isNaN(h)) {
                        h = 1;
                      }
                      return h * heightRate * 100;
                    })
                    .color(color)
                    .style({
                      opacity: 1.0
                    });
                  if (isNew) {
                    this.scene.addLayer(component);
                  }
                  const zIndex = v.custom.zIndex.value;
                  const minScale = v.custom.minScale.value;
                  const maxScale = v.custom.maxScale.value;
                  component.setIndex(zIndex);
                  minScale && component.setMinZoom(minScale);
                  maxScale && component.setMaxZoom(maxScale);
                  v.show ? component.show() : component.hide();
                  this.scene.render();
                })
                .catch(err => {
                  console.log('error========', err);
                });
            }
          }
        } else if (type === 'mapBorders') {
          const url = v.custom.url.value.url;
          const colorRgba = v.custom.color.value;
          const size = v.custom.size.value;
          const opacity = v.custom.opacity.value;
          const color = colorRgba ? hexify(colorRgba) : '#816CAD';
          if (!url) {
            if (this.scene.getLayerByName(v.id)) {
              this.scene.removeLayer(this.layers[v.id].component);
              this.layers[v.id].url = undefined;
            }
          } else {
            if (
              !this.layers[v.id] ||
              this.layers[v.id].url !== url ||
              this.layers[v.id].color !== color
            ) {
              fetch(url)
                .then(res => res.json())
                .then(buildingmodeljson => {
                  let isNew = false;
                  const res = this.transformGeojson(buildingmodeljson);
                  if (!this.layers[v.id] || !this.scene.getLayerByName(v.id)) {
                    component = new L7.LineLayer({
                      name: v.id,
                      zIndex: v.custom.zIndex.value || 1
                    });
                    component.source(res);
                    this.layers[v.id] = {
                      value: v,
                      component,
                      url,
                      color
                    };
                    isNew = true;
                  } else {
                    component = this.layers[v.id].component;
                    component.setData(res);
                  }
                  component
                    .size(size)
                    .color(color)
                    .style({
                      opacity
                    });
                  if (isNew) {
                    this.scene.addLayer(component);
                  }
                  const zIndex = v.custom.zIndex.value;
                  component.setIndex(zIndex);
                  v.show ? component.show() : component.hide();
                  this.scene.render();
                });
            }
          }
        }
      }

      for (let k in this.layers) {
        const layer = this.layers[k];
        if (!layer) continue;

        const layerIn = subcomponents.value.find(v => v.id === k);
        if (!layerIn) {
          if (this.scene.getLayerByName(k)) {
            this.scene.removeLayer(layer.component);
          }
          if (layer.value.type === 'marker') {
            const component = layer.component;
            component.clear();
            this.scene.removeMarkerLayer(component);
          }
          this.layers[k] = undefined;
        }
      }

      this.scene.render();
    },
    transformGeojson (data) {
      const dv = new DataSet.DataView().source(data, {
        type: 'GeoJSON',
      });
      dv.transform({
        type: 'map',
        callback (row) {
          const { latitude, longitude, geometry } = row;
          row.latitude = latitude.map(num => num * 1);
          row.longitude = longitude.map(num => num * 1);
          const { coordinates } = geometry;
          row.geometry.coordinates = coordinates.map(sub => {
            return sub.map(arr => {
              const [x, y] = arr;
              return [x + 0.0048, y - 0.003];
            });
          });
          return row;
        },
      });
      const res = {
        type: 'FeatureCollection',
        features: dv.rows
      };
      return res;
    }
  },

  mounted () {
    console.log('city3d vue mounted----新项目组件');
    window.city3d = window.city3d || {};
    window.city3d[new Date().getTime()] = this;
    window.city3dlast = this;
    console.log('city3dlast: ', this);

    this.onMounted();
  }
};
</script>

<style lang="scss">
.city3d-marker-wrap {
  position: relative;
  /* background-color: rgb(255, 0, 0); */
}
.city3d-marker {
  position: relative;
  top: -20px;
  left: 140px;
  /* padding: 8px 8px; */
  color: #fff;
}
.city3d-marker-img {
  position: absolute;
  z-index: -1;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.city3dwrap {
  .l7-popup {
    color: #000;
    .l7-popup-tip {
      display: none;
    }
    .l7-popup-content {
      background: transparent;
      border-radius: 0;
      padding: 0;
    }
    .dialog-container {
      background-size: 100% 100% !important;
      min-width: 320px;
      padding: 15px 10px;
    }
    .header {
      line-height: 36px;
      color: #fff;
      font-weight: 600;
      padding: 0 15px;
      font-size: 15px;
    }
    .content {
      display: flex;
      padding: 10px 15px;
      .image {
        width: 110px;
        height: 140px;
        border: 2px solid #fb0e3e;
        position: relative;
        &::before {
          content: '';
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 2;
          box-shadow: inset 0px 0px 15px #fb0e3e;
        }
        img {
          height: 100%;
          width: 100%;
          display: block;
          object-fit: contain;
        }
      }
      ul {
        flex: 1;
        margin-left: 10px;
        margin-bottom: 0;
        .info-item {
          display: flex;
          line-height: 1.5;
          font-size: 14px;
          .item-title {
            color: #29eded;
            width: 68px;
            text-align: justify;
            text-align-last: justify;
          }
          .item-content {
            color: #fff;
            flex: 1;
            margin-left: 10px;
            white-space: nowrap;
          }
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.val {
  font-weight: bold;
}
.map-container {
  // height: 270px;
  width: 100%;
  height: 100%;
  position: relative;
}
.maphandbar-wrap {
  height: 0;
  width: 100%;
  right: 0;
  position: relative;
}
.maphandbar {
  height: 8%;
  min-height: 30px;
  max-height: 100px;
  position: absolute;
  bottom: 0;
  width: 100%;
}
.maphandbar:hover {
  height: 20%;
  background-color: rgba(0, 0, 0, 0.2);
  cursor: move;
}
</style>
