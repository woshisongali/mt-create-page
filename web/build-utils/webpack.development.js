const webpack = require('webpack')
const server = require('./server')
const serverConfig = require('./config')
const {clone} = require('./util')
// require('')
const mockConfig = {
  '/birds': './birds',
  '/downTest': '../components/down-select/mock/product'
}
const originalProxy = {

}
function transformMockToProxy () {
  let mockObj = {
  }
  Object.keys(mockConfig).map(key => {
    mockObj[key] = 'http://localhost:' + serverConfig.SERVER_PORT
  })
  return mockObj
}

const transformedMock = transformMockToProxy()
const curProxy = (function () {
  let proxy = clone(originalProxy)
  Object.keys(transformedMock).map(key => {
    if (proxy[key] === void 0 || proxy[key] === null) {
      proxy[key] = transformedMock[key]
    }
  })
  return proxy
})()

module.exports = () => ({
  devServer: {
    port: serverConfig.WEBPACK_PORT,
    // proxy: {
    //   '/birds': 'http://localhost:5000',
    //   '/downTest': 'http://localhost:5000'
    // },
    proxy: curProxy,
    before (app) {
      // console.log('============= before server')
      server.start(mockConfig)
    }
  },
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.styl(us)?$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'stylus-loader'
        ],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [ "style-loader", "css-loader"],
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      { test: /\.(gif|png|jpg|woff|svg|ttf|eot)$/, 
        use: [{
          loader:'url-loader',
          options: {
            limit:500//当图片小于这个值他会生成一个图片的url 如果是一个大于的他会生成一个base64的图片在js里展示
          } 
        }]
      }
    ]
  },

  stats: {
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  },

  plugins: [
    // new webpack.HotModuleReplacementPlugin()
  ]
});
