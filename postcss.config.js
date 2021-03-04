module.exports = {
  // You can specify any options from http://api.postcss.org/global.html#processOptions here
  // parser: 'sugarss',
  plugins: [
    // Plugins for PostCSS
    require('postcss-preset-env')
  ],
};

// module.exports = {
//   plugins: [
//     require('postcss-import'),
//     require('autoprefixer'),
//     require('cssnano')({
//       preset: [
//         'default',
//         { discardComments: { removeAll: true } }
//       ]
//     })
//   ]
// }
// module.exports = {
//   plugins: [
//     // 'postcss-import',
//     'autoprefixer',
//     // ['cssnano',
//     //   {
//     //      preset: [
//     //         'default',
//     //         { discardComments: { removeAll: true } }
//     //     ]
//     //   }
//     // ]
//   ]
// }
