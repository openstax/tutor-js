React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
{ExerciseActions, ExerciseStore} = require '../../stores/exercise'

Books        = require './books'
Lo           = require './lo'
QuestionType = require './question-type'
FilterType   = require './filter-type'
CnxMod       = require './cnx-mod'
CnxFeature   = require './cnx-feature'
Dok          = require './dok'
Blooms       = require './blooms'
Time         = require './time'
RequiresContext = require './requires-context'

ExerciseTags = React.createClass
  propTypes:
    exerciseId: React.PropTypes.string.isRequired

  render: ->
    {id} = @props

    <div className="tags">
      <BS.Row>
        <Books           {...@props} />
        <Lo              {...@props} />
        <QuestionType    {...@props} />
        <FilterType      {...@props} />
        <RequiresContext {...@props} />
        <CnxMod          {...@props} />
        <CnxFeature      {...@props} />
        <Dok             {...@props} />
        <Blooms          {...@props} />
        <Time            {...@props} />
      </BS.Row>
    </div>


module.exports = ExerciseTags
