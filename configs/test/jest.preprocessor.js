const coffee = require('coffee-script');
const transform = require('coffee-react-transform');

module.exports = {
  process: function(src, path) {
    const isCoffee = path.match(/\.cjsx$/)
    if (coffee.helpers.isCoffee(path) || isCoffee) {
      if (isCoffee) { src = transform(src); }
      return coffee.compile(src, {'bare': true});
    }
    return src;
  }
};
