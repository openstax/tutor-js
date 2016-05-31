// Validates the package.json file to make sure semantic versioning is not used (ie `npm install --save-dev`)

var data = require('../package.json');

function validate(group) {
  var packageNames = Object.keys(data[group]);
  for (var index in packageNames) {
    var packageName = packageNames[index];
    var ver = data[group][packageName];
    // Either the format is `0.0.0` or `xxx/xxx#sha` or `xxx/xxx#tag`
    if (/^[0-9]+\.[0-9]+\.[0-9]+/.test(ver) || /.*\/.*#[a-zA-Z0-9_]/.test(ver)) {
    } else {
      console.log('Invalid entry in package.json ' + group + '. package must be an exact version or point to a GitHub repo: ' + packageName + ' ' + ver);
      process.exit(1);
    }
  }
}

validate('dependencies');
validate('devDependencies');
