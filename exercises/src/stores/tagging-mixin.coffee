_ = require 'underscore'

Actions =

  addBlankPrefixedTag: (id, {prefix}) ->
    prefix += ':'
    tags = _.clone( @_get(id).tags )
    # is there already a blank one?
    unless _.find( tags, (tag) -> tag is prefix )
      tags.push(prefix)
      @_change(id, {tags})

  # Updates or creates a prefixed tag
  # If previous is given, then only the tag with that value will be updated
  # Otherwise it will be added (unless it exists)
  # If replaceOthers is set, all others will prefix will be removed
  setPrefixedTag: (id, {prefix, tag, tags, previous, replaceOthers}) ->
    prefix += ':'
    if tags
      tags = _.reject(@_get(id).tags, (tag) -> 0 is tag.indexOf(prefix))
        .concat( _.map tags, (tag) -> prefix + tag )
    else if replaceOthers
      tags = _.reject @_get(id).tags, (tag) -> 0 is tag.indexOf(prefix)
    else
      tags = _.clone @_get(id).tags

    if previous?
      tags = _.reject tags, (tag) -> tag is prefix + previous

    if tag and not _.find(tags, (tag) -> tag is prefix + tag)
      tags.push(prefix + tag)

    @_change(id, {tags})


Store =
    getTagsWithPrefix: (id, prefix) ->
      prefix += ':'
      tags = _.select @_get(id).tags, (tag) -> 0 is tag.indexOf(prefix)
      _.map( tags, (tag) -> tag.replace(prefix, '') ).sort() or []


Extend =
  extend: (config) ->
    _.extend( config, Actions )
    _.extend( config.exports, Store )

module.exports = Extend
