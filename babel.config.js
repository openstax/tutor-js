module.exports = {
  presets: [
    [
      '@babel/preset-env', {
        useBuiltIns: 'usage',
        targets: '> 3% in US',
      },
    ], [
      '@babel/preset-react', {

      },
    ],
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true } ],
    ['@babel/plugin-proposal-class-properties', { loose: true } ],
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-syntax-dynamic-import',
    'babel-plugin-styled-components',
    'babel-plugin-lodash',
  ],
};

// {
//   'plugins': [
//     'transform-decorators-legacy',
//     'transform-class-properties',
//     'transform-function-bind',
//     'transform-react-jsx',
//     'babel-plugin-lodash',
//     'transform-runtime'
//   ],
//   'presets': [
//     ['es2015', { 'modules': false }],
//     'react',
//     'stage-1',
//   ],
//   'env': {
//     'test': {
//       'plugins': [
//         'transform-decorators-legacy',
//         'transform-class-properties',
//         'transform-function-bind',
//         'syntax-dynamic-import',
//         'transform-react-jsx',
//         'dynamic-import-node',
//         'transform-runtime'
//       ],
//       'presets': [
//         'es2015', 'react', 'stage-1',
//       ]
//     }
//   }
// }
