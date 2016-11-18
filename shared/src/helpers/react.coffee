indexOf   = require 'lodash/indexOf'
pickBy    = require 'lodash/pickBy'
concat    = require 'lodash/concat'
some      = require 'lodash/some'
kebabCase = require 'lodash/kebabCase'

getBaseName = (context) -> kebabCase(context.constructor.displayName)


PASSABLE_PROPS = ['className', 'id', 'children', 'target', 'ref', 'tabIndex', 'role']
PASSABLE_PREFIXES = ['data-', 'aria-', 'on']
filterProps = (props, options = {}) ->
  pickBy props, (prop, name) ->

    indexOf(concat(PASSABLE_PROPS, options.props or []), name) > -1 or
      some(concat(PASSABLE_PREFIXES, options.prefixes or []), (prefix) ->
        name.indexOf(prefix) is 0
      )

module.exports = {getBaseName, filterProps}
