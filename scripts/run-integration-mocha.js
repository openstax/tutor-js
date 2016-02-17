
// This is run so node-inspector can hide all the files in `node_modules`
// but still start up & wait using `--debug-brk`.
//
// - running `mocha` directly spawns a new process that actually runs the tests
// - running `_mocha` directly: `node-inspector` would not pause because we
//     start it with the `--hidden 'node_modules'` arg which makes things run faster
//     because `node-inspector` does not have to instrument all the files
require('mocha/bin/_mocha');
