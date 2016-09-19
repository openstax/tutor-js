React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

PREFIX = 'requires-context'
Wrapper = require './wrapper'

RequiresContextTag = React.createClass

  propTypes:
    id:      React.PropTypes.string.isRequired
    store:   React.PropTypes.object.isRequired
    actions: React.PropTypes.object.isRequired

  updateTag: (ev) ->
    tag = if ev.target.checked then 'true' else false # false will remove tag
    @props.actions.setPrefixedTag(@props.id, prefix: PREFIX, tag: tag, replaceOthers:true)

  render: ->
    tag = _.first(@props.store.getTagsWithPrefix(@props.id, PREFIX)) or 'false'

    <Wrapper label="Requires Context">
      <div className="tag">
        <input type="checkbox" label="" onChange={@updateTag} checked={tag is 'true'} />
      </div>
    </Wrapper>

module.exports = RequiresContextTag
