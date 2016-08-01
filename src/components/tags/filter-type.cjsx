React = require 'react'
_ = require 'underscore'

Wrapper = require './wrapper'
Multiselect = require 'react-widgets/lib/Multiselect'

PREFIX = 'filter-type'
TYPES = [
  {id: 'vocabulary',   title: 'Vocabulary'    }
  {id: 'test-prep',    title: 'Test Prep'     }
  {id: 'ap-test-prep', title: 'AP® Test Prep' }
]

FilterTypeTag = React.createClass

  propTypes:
    id:      React.PropTypes.string.isRequired
    store:   React.PropTypes.object.isRequired
    actions: React.PropTypes.object.isRequired

  updateTag: (types) ->
    tags = _.map types, (tag, v) ->
      if _.isObject(tag) then tag.id else tag
    @props.actions.setPrefixedTag(@props.id, prefix: PREFIX, tags: tags)

  render: ->
    tags = @props.store.getTagsWithPrefix(@props.id, PREFIX)

    <Wrapper label="Filter Type">
      <div className="tag">
        <Multiselect
          valueField='title'
          textField='title' valueField='id'
          data={TYPES} value={tags} onChange={@updateTag}
        />
      </div>
    </Wrapper>

module.exports = FilterTypeTag
