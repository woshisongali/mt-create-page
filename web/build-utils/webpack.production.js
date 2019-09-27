const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

// const DropConsoleWebpackPlugin = require('drop-console-webpack-plugin')

module.exports = () => ({
  // output: {
  //   filename: "bundle.js"
  // },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          warnings: false,
          drop_debugger: true,
          drop_console: true,
          sourceMap: true
        }
      }),

      new OptimizeCSSAssetsPlugin({})
    ],

    splitChunks: {
      cacheGroups: {
          commons: {
              name: "commons",
              chunks: "initial",
              minChunks: 2
          }
      }
    }
  },
  output: {
    publicPath: 'http://127.0.0.1:3000/dist',
  },
  module: {
    rules: [
      {
        test: /\.styl(us)?$/,
        use: [
          MiniCssExtractPlugin.loader, 
          "css-loader",
           "stylus-loader"
        ]
        // use: ["style-loader", "css-loader", "stylus-loader"]
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      },
      {
        test: /\.js$/,
        use: ['babel-loader']
      },

      { test: /\.(gif|png|jpg|woff|svg|ttf|eot)$/, 
        use: [{
          loader:'url-loader',
          options: {
              limit:500,
              outputPath: 'img/',// 指定打包后的图片位置
              // name:'[name].[ext]?',//name:'[path][name].[ext]
              name:'[name]-[hash].[ext]',
              publicPath:'../img/'
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
    //配置环境
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin()
    // new BundleAnalyzerPlugin({ analyzerPort: 8919 }),
    
  ]
});
