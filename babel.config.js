console.log();

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
    ['babel-plugin-transform-imports', {
      'react-bootstrap': {
        transform: 'react-bootstrap/lib/${member}',
        'preventFullImport': true,
      },
      lodash: {
        transform: 'lodash/${member}',
        preventFullImport: ('test' === process.env.NODE_ENV) ? false : true,
      },
    }],
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-syntax-dynamic-import',
    'babel-plugin-styled-components',
  ],
};
