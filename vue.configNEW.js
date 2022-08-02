const CopyPlugin = require('copy-webpack-plugin')
module.exports = {

  filenameHashing:false,
  productionSourceMap: false,
  assetsDir: './assets/',
  pages: {
    index: {
      entry: 'src/index.js',
      template: 'public/index.html',
      filename: 'index.html'
    }
  },
  /*devServer: {
    clientLogLevel: 'warning',
    hot: true,
    contentBase: 'dist',
    compress: true,
    open: true,
    overlay: { warnings: false, errors: true },
    publicPath: '/',
    quiet: true,
    watchOptions: {
      poll: false,
      ignored: /node_modules/
    }
  },*/

  chainWebpack: config => {
    config.plugins.delete('prefetch-index'),
    config.module
      .rule('vue')
        .use('vue-loader')
          .tap(args => {
            args.compilerOptions.whitespace = 'preserve'
          })
  },
  configureWebpack: {
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
      new CopyPlugin([
        { from: "src/assets/img", to: "assets/img" },
        { from: "src/assets/logos", to: "assets/logos" },
        { from: "src/assets/fonts", to: "assets/fonts" }
      ]),
    ]
  }
}
