cloneDeep = require 'lodash/cloneDeep'

# similar custom configs as production
productionConfig = require './webpack.production'

debugConfig = cloneDeep(productionConfig)
debugConfig.output.filename = 'main.js'

module.exports = debugConfig
