/* create by bailihaha */
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpackMerge = require("webpack-merge");
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path')
const modeConfig = env => require(`./build-utils/webpack.${env}`)(env);

const sourceObj = {
  entry: {
    // 'index': './pages/program1/index/src/index.js'
    "./home/index": "./pages/home/index.js",
     "./vendor": ['vue']
    // 'index': './src/index2.js'
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name]-bundle.js",
    chunkFilename: "[name].[chunkhash].js"
  }
}

// function resolveEntry (filePath) {
//   let entryPath = filePath
//   if ()
// }


module.exports = ({
  mode,
  presets
} = {
  mode: "production",
  presets: []
}) => {
  return webpackMerge({
      mode,
      module: {
        rules: [
          // { test: /\.jpg$/, use: [ "file-loader" ] }
          {
            test: /\.vue$/,
            loader: 'vue-loader',
            exclude: /node_modules/
          }
        ]
      },

      resolve: {
          // alias: {
          //     'vue': 'vue/dist/vue.js'
          // }
      },

      plugins: [
        new HtmlWebpackPlugin({
          // template: './pages/program1/index/index.html'
          template: "./pages/home/index.html"
        }), 
        
        new webpack.ProgressPlugin(),
        new VueLoaderPlugin()
      ]
    },
    sourceObj,
    modeConfig(mode)
  );
};