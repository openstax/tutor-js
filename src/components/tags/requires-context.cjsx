React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

PREFIX = 'requires-context'
Wrapper = require './wrapper'
{ExerciseActions, ExerciseStore} = require '../../stores/exercise'

RequiresContextTag = React.createClass

  propTypes:
    exerciseId: React.PropTypes.string.isRequired

  updateTag: (ev) ->
    tag = if ev.target.checked then 'true' else false # false will remove tag
    ExerciseActions.setPrefixedTag(@props.exerciseId, prefix: PREFIX, tag: tag, replaceOthers:true)

  render: ->
    tag = _.first ExerciseStore.getTagsWithPrefix(@props.exerciseId, PREFIX)

    <Wrapper label="Requires Context">
      <div className="tag">
        <input type="checkbox" label="" onChange={@updateTag} checked={tag is 'true'} />
      </div>
    </Wrapper>

module.exports = RequiresContextTag
