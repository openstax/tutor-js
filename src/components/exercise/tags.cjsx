React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

{ExerciseActions, ExerciseStore} = require 'stores/exercise'

Books           = require 'components/tags/books'
Lo              = require 'components/tags/lo'
QuestionType    = require 'components/tags/question-type'
FilterType      = require 'components/tags/filter-type'
CnxMod          = require 'components/tags/cnx-mod'
CnxFeature      = require 'components/tags/cnx-feature'
Dok             = require 'components/tags/dok'
Blooms          = require 'components/tags/blooms'
Time            = require 'components/tags/time'
RequiresContext = require 'components/tags/requires-context'

ExerciseTags = React.createClass
  propTypes:
    exerciseId: React.PropTypes.string.isRequired

  render: ->
    tagProps = {
      id: @props.exerciseId
      store:   ExerciseStore
      actions: ExerciseActions
    }
    <div className="tags">
      <BS.Row>
        <Books           {...tagProps} />
        <Lo              {...tagProps} />
        <QuestionType    {...tagProps} />
        <FilterType      {...tagProps} />
        <RequiresContext {...tagProps} />
        <CnxMod          {...tagProps} />
        <CnxFeature      {...tagProps} />
        <Dok             {...tagProps} />
        <Blooms          {...tagProps} />
        <Time            {...tagProps} />
      </BS.Row>
    </div>


module.exports = ExerciseTags
