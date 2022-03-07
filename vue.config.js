// const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  devServer: {
    headers:{
      'Access-Control-Allow-Origin': '*' // 允许跨域
    }
  },
  lintOnSave: false
};
