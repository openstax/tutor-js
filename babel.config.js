module.exports = {
    presets: [
        [
            '@babel/preset-env', {
                useBuiltIns: 'entry',
                corejs: 3,
                debug: false,
                // https://browserl.ist/?q=%3E1%25%2C+last+2+versions%2C+not+op_mini+all%2C+not+ie+%3E+0%2C+not+dead%2C+safari+%3E%3D+10%2C+iOS+%3E+8
                targets: ['>1%', 'last 2 versions', 'not op_mini all', 'not ie > 0', 'safari >= 10', 'iOS > 8', 'not dead'],
            },
        ],
        '@babel/preset-react',
        '@babel/preset-typescript',
    ],
    plugins: [
        '@babel/transform-runtime',
        '@babel/plugin-proposal-optional-chaining',

        ['@babel/plugin-proposal-decorators', { legacy: true } ],
        ['@babel/plugin-proposal-class-properties', { loose: false } ],
        ['babel-plugin-transform-imports', {
            'react-bootstrap': {
                transform: 'react-bootstrap/${member}',
                'preventFullImport': true,
            },
            lodash: {
                transform: 'lodash/${member}',
                preventFullImport: ('test' === process.env.NODE_ENV) ? false : true,
            },
        }],
        [ 'babel-plugin-styled-components', {
            fileName: false,
        }],
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-syntax-dynamic-import',
    ],
};
