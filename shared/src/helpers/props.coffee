without = require 'lodash/without'
omit = require 'lodash/omit'
keys = require 'lodash/keys'

module.exports =
  removeDefined: (obj, options = {}) ->
    namedProps = keys(obj.constructor.propTypes)
    if options.allow
      namedProps = without(namedProps, options.allow)
    if options.alsoExclude
      namedProps = without(namedProps, options.alsoExclude)

    omit(obj.props, namedProps)
