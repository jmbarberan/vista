const CopyPlugin = require("copy-webpack-plugin");
module.exports = {
  filenameHashing:false,
  productionSourceMap: false,
  configureWebpack:{
    devtool: 'source-map',
    resolve: {
      symlinks: false
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          default: false,
          // Custom common chunk
          bundle: {
            name: 'commons',
            chunks: 'all',
            minChunks: 3,
            reuseExistingChunk: false,
          },
          // Customer vendor
          vendors: {
            chunks: 'initial',
            name: 'vendors',
            test: 'vendors',
          },
          // Merge all the CSS into one file
          styles: {
            name: 'styles',
            test: /\.s?css$/,
            chunks: 'all',
            minChunks: 1,
            reuseExistingChunk: true,
            enforce: true,
          },
        }  
      }
    },
    plugins: [
      new CopyPlugin(
        [
          { from: "src/assets/img", to: "assets/img" },
          { from: "src/assets/logos", to: "assets/logos" },
          { from: "src/assets/fonts", to: "assets/fonts" }
        ]
      ),
    ],
  }
}