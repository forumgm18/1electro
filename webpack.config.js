const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')


const HandlebarsPlugin = require ( 'handlebars-webpack-plugin' ) ;
const ImageminPlugin = require("imagemin-webpack");

console.log('config: ', path.resolve(__dirname, 'postcss.config.js'))

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all'
    }
  }

  if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetWebpackPlugin(),
      new TerserWebpackPlugin()
    ]
  }

  return config
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

// const cssLoaders = extra => {
//   const loaders = [
//     {
//       loader: MiniCssExtractPlugin.loader,
//       options: {
//         // hmr: isDev,
//         // reloadAll: true
//       },
//     },
//
//     {
//       loader: 'css-loader',
//       // options: {
//       //   sourceMap: true,
//       //   // minimize: true,
//       //   url: false,
//       //   importLoaders: 1
//       // }
//     },
//     'postcss-loader',
//     // {
//     //   loader: 'postcss-loader',
//     //   options: {
//     //     sourceMap: true,
//     //     // postcssOptions: {
//     //     //   config: {
//     //     //     plugins: [
//     //     //       ['postcss-short', { prefix: 'x' }],
//     //     //       'postcss-present-env',
//     //     //     ],
//     //     //   }
//     //     // }
//     //   }
//     // },
//
//   ]
//
//   if (extra) {
//     if(extra == 'sass-loader') {
//       loaders.push( {
//           loader: 'sass-loader',
//           // options: {
//           //   sourceMap: true,
//           //   sassOptions: {outputStyle: 'compact'}
//           // }
//         }
//       )
//     } else {
//       loaders.push(extra)
//     }
//   }
//
//   return loaders
// }

const babelOptions = preset => {
  const opts = {
    presets: [
      '@babel/preset-env'
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties'
    ]
  }

  if (preset) {
    opts.presets.push(preset)
  }

  return opts
}


const jsLoaders = () => {
  const loaders = [{
    loader: 'babel-loader',
    options: babelOptions()
  }]

  if (isDev) {
    loaders.push('eslint-loader')
  }

  return loaders
}

const plugins = () => {
  const base = [
    // new HTMLWebpackPlugin({
    //   template: './index.html',
    //   minify: {
    //     collapseWhitespace: isProd
    //   }
    // }),
    new CleanWebpackPlugin(),

    new HandlebarsPlugin({
      // path to hbs entry file(s). Also supports nested directories if write path.join(process.cwd(), "app", "src", "**", "*.hbs"),
      entry: path.join(process.cwd(), "src", "html", "templates", "*.hbs"),
      // output path and filename(s). This should lie within the webpacks output-folder
      // if ommited, the input filepath stripped of its extension will be used
      output: path.join(process.cwd(), "dist", "[name].html"),
      // you can als add a [path] variable, which will emit the files with their relative path, like
      // output: path.join(process.cwd(), "build", [path], "[name].html"),

      // data passed to main hbs template: `main-template(data)`
      data: path.join(__dirname, "src", "html", "data/data.json"),

      // globbed path to partials, where folder/filename is unique
      partials: [
        path.join(process.cwd(), "src", "html", "templates", "partials", "*.hbs"),
        path.join(process.cwd(), "src", "html", "templates", "partials", "chunk", "*.hbs")
      ],

      // register custom helpers. May be either a function or a glob-pattern
      helpers: {
        objToStr: function(context) {
          let res=JSON.stringify(context);
          // let res=JSON.parse(context);
          console.log("res: ",res);
          console.log("context: ", context);
          return res;
        },

        eachKey: function(key, tag, context, options) {
          let ret = "";
          let tagStart = '<' + tag + ' style="color:red;">';
          let tagEnd = "</" + tag + ">";


          let arr = Object.values(context[key]);

          for (let i = 0; i < arr.length; i++) {
            ret = ret + tagStart + arr[i] + tagEnd;
          }
          return new HandlebarsPlugin.Handlebars.SafeString(ret);
        },
        subObj: function(key, context) {
          return context[key];
        },

        forAll: function(n, block) {
          let accum = '';
          let i;
          for(i = 0; i < n; ++i)
            accum += block.fn(i);

          console.log(accum);
          return accum;

        },


      },

      // hooks
      // getTargetFilepath: function (filepath, outputTemplate) {},
      // getPartialId: function (filePath) {}
      // onBeforeSetup: function (Handlebars) {},
      // onBeforeAddPartials: function (Handlebars, partialsMap) {},
      // onBeforeCompile: function (Handlebars, templateContent) { console.log(templateContent)},
      // onBeforeRender: function (Handlebars, data, filename) {},
      // onBeforeSave: function (Handlebars, resultHtml, filename) {},
      // onDone: function (Handlebars, filename) {}
    }),

    new MiniCssExtractPlugin({
      filename: './css/' + filename('css')
    }),

    new CopyWebpackPlugin([
      // {
      //   from: path.resolve(__dirname, 'src/old-css'),
      //   to: path.resolve(__dirname, 'dist/css')
      // },
      {
        from: path.resolve(__dirname, 'src/fonts/*'),
        to: path.resolve(__dirname, 'dist')
      },
      {
        from: path.resolve(__dirname, 'src/plugins/**/*'),
        to: path.resolve(__dirname, 'dist/js'),
        // flatten: true,
      },
      {
        // context: path.resolve(__dirname, 'src/img'),
        from: path.resolve(__dirname, 'src/images/**'),
        to: path.resolve(__dirname, 'dist'),
        globOptions:{
          ignore:['**/svg/**']
        }
        // flatten: true,
      },
      {
        from: path.resolve(__dirname, 'src/images/svg/*.svg'),
        to: path.resolve(__dirname, 'dist/images'),
        flatten: true,
      },
      {
        from: path.resolve(__dirname, 'src/local/assets/images/**'),
        to: path.resolve(__dirname, 'dist/local/assets/images'),
        flatten: true,
      },
      {
        from: path.resolve(__dirname, 'src/js/*.js'),
        to: path.resolve(__dirname, 'dist/js'),
        flatten: true,
      }
    ]),

    new ImageminPlugin({
      test: /\.(jpe?g|png|gif)$/i,
      name: '[path][name].[ext]',
      bail: false, // Ignore errors on corrupted images
      cache: true,
      // cache: false,
      imageminOptions: {
        // Before using imagemin plugins make sure you have added them in `package.json` (`devDependencies`) and installed them

        // Lossless optimization with custom option
        // Feel free to experiment with options for better result for you
        plugins: [
          ["gifsicle", { interlaced: true }],
          ["jpegtran", { progressive: true }],
          ["optipng", { optimizationLevel: 5 }],
        ]
      }
    }),

  ]

  if (isProd) {
    base.push(new BundleAnalyzerPlugin())
  }

  return base
}

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: {
    main: ['@babel/polyfill', './index.js']
    // analytics: './analytics.ts'
  },
  output: {
    filename: './js/' + filename('js'),
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.js', '.json', '.png'],
    alias: {
      '@models': path.resolve(__dirname, 'src/models'),
      '@scss': path.resolve(__dirname, 'src/scss'),
      '@': path.resolve(__dirname, 'src'),
    }
  },
  optimization: optimization(),
  devServer: {
    port: 4200,
    hot: isDev
  },
  devtool: isDev ? 'source-map' : '',
  plugins: plugins(),
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/,
        // use: cssLoaders('sass-loader')
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDev,
              reloadAll: true
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              url: false,
              importLoaders: 3,
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              postcssOptions: {
                config: path.resolve(__dirname, 'postcss.config.js')
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              sassOptions: {outputStyle: 'compact'}
            }
          }

        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders()
      },
    ]
  }
}
