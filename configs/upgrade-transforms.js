const VENDOR = '/Users/nas/code/vendor'

const REACT = [
    'create-element-to-jsx', 'class','findDOMNode', 'rename-unsafe-lifecycles',
    'React-PropTypes-to-prop-types', 'sort-comp',
];

const CPOJER = ['no-vars', 'rm-requires', 'template-literals', 'trailing-commas'];

const req = (s) => {
    const func = require(`${VENDOR}/${s}`);
    return func.default ? func.default : func;
};

const FIXES = REACT.map(
    (s) => req(`react-codemod/transforms/${s}.js`)
).concat(
    CPOJER.map((s) => req(`js-codemod/transforms/${s}.js`)),
);


module.exports = function(file, api, options) {
    let src = file.source;
    FIXES.forEach(fix => {
        if (typeof(src) === 'undefined') { return; }
        const nextSrc = fix({ ...file, source: src }, api, options);

        if (nextSrc) {
            src = nextSrc;
        }
    });
    return src;
};
