React = require 'react'
_ = require 'underscore'

Wrapper = require './wrapper'
Multiselect = require 'react-widgets/lib/Multiselect'
{ExerciseActions, ExerciseStore} = require '../../stores/exercise'

PREFIX = 'filter-type'
TYPES = [
  {id: 'vocabulary',   title: 'Vocabulary'    }
  {id: 'test-prep',    title: 'Test Prep'     }
  {id: 'ap-test-prep', title: 'AP® Test Prep' }
]

FilterTypeTag = React.createClass

  propTypes:
    exerciseId: React.PropTypes.string.isRequired

  updateTag: (types) ->
    tags = _.map types, (tag, v) ->
      if _.isObject(tag) then tag.id else tag
    ExerciseActions.setPrefixedTag(@props.exerciseId, prefix: PREFIX, tags: tags)

  render: ->
    tags = ExerciseStore.getTagsWithPrefix(@props.exerciseId, PREFIX)

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
