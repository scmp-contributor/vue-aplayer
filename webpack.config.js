var path = require('path')
var webpack = require('webpack')
var merge = require('webpack-merge');

var commonConfig = {
  entry: './src/vue-aplayer.vue',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'vue-aplayer.min.js',
    library: 'VueAPlayer',
    libraryTarget: 'umd',
    libraryExport: 'default',
    umdNamedDefine: true
  },

  externals: {
    'hls.js': {
      amd: 'hls.js',
      commonjs: 'hls.js',
      commonjs2: 'hls.js',
      root: 'Hls'
    },
    'vue':  {
      amd: 'vue',
      commonjs: 'vue',
      commonjs2: 'vue',
      root: 'Vue'
    },
  },

  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [path.resolve(__dirname, 'src')],
        options: {
          formatter: require('eslint-friendly-formatter'),
          emitWarning: true
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            scss: 'vue-style-loader!css-loader?minimize=true!postcss-loader!sass-loader'
          },
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=40000'
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      },
      {
        test: /\.html$/,
        loader: 'vue-html-loader'
      }
    ]
  },
  devtool: '#source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: `"${process.env.NODE_ENV}"`
      },
      VERSION: JSON.stringify(require('./package.json').version)
    }),
  ]
}

if (process.env.NODE_ENV === 'production') {
  // http://vuejs.github.io/vue-loader/workflow/production.html
  commonConfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
    })
  )
}

module.exports = [

  // Config 1: For browser environment
  merge(commonConfig, {
    entry: path.resolve(__dirname + '/src/plugin.js'),
    output: {
      filename: 'vue-aplayer.min.js',
      libraryTarget: 'window',
      library: 'VueAPlayer'
    }
  }),

  // Config 2: For Node-based development environments
  merge(commonConfig, {
    entry: path.resolve(__dirname + '/src/main.js'),
    output: {
      filename: 'vue-aplayer.js',
      libraryTarget: 'umd',

      // These options are useful if the user wants to load the module with UMD
      library: 'vue-aplayer',
      umdNamedDefine: true
    }
  })
];