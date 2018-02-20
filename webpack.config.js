require('coffee-script/register');
require('es6-promise').polyfill();

makeConfig = require("./configs/webpack/makeConfig");
if (!process.env.OX_PROJECT){
  console.warn("OX_PROJECT env var is not defined");
  process.exit(1);
}

var mode = process.env.NODE_ENV || 'development';
console.log("mode: ", mode);
config = makeConfig(process.env.OX_PROJECT, mode);


// testing debug - rm before mergeing
// console.dir(config);

module.exports = config
