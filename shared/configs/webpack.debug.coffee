_ = require 'lodash'

# similar custom configs as production
productionConfig = require './webpack.production'

debugConfig = _.cloneDeep(productionConfig)
debugConfig.output.filename = 'main.js'

module.exports = debugConfig
