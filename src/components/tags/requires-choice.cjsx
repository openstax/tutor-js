React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

Wrapper = require './wrapper'
{ExerciseActions, ExerciseStore} = require '../../stores/exercise'

FilterTypeTag = React.createClass

  propTypes:
    exerciseId: React.PropTypes.string.isRequired

  updateTag: (ev) ->
    ExerciseActions.setPrefixedTag(@props.exerciseId, prefix: PREFIX, tag: ev.target.value)

  render: ->
    tag = _.first ExerciseStore.getTagsWithPrefix(@props.exerciseId, PREFIX)

    <Wrapper label="Format">
      <div className="tag">
        <BS.Input type="checkbox" label="" checked={tag is 'true'} />
      </div>
    </Wrapper>

module.exports = FilterTypeTag
