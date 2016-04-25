React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
classnames = require 'classnames'

{VocabularyActions, VocabularyStore} = require 'stores/vocabulary'
Distractors = require 'components/vocabulary/distractors'
Tags = require 'components/vocabulary/tags'

Vocabulary = React.createClass
  propTypes:
    id:   React.PropTypes.string.isRequired

  setTerm: (ev) -> VocabularyActions.change(@props.id, term: ev.target.value)
  setDescription: (ev) -> VocabularyActions.change(@props.id, description: ev.target.value)

  update: -> @forceUpdate()

  componentWillMount: ->
    VocabularyStore.addChangeListener(@update)

  componentWillUnmount: ->
    VocabularyStore.removeChangeListener(@update)

  render: ->
    vt = VocabularyStore.get(@props.id)

    <div className='vocabulary-editor'>

      <BS.Row>
        <BS.Col sm=6>

          <BS.Input type="text" label="Key Term" onChange={@setTerm} value={vt.term} />

          <BS.Input type="textarea" label="Key Term Definition"
            onChange={@setDescription} value={vt.description} />

        </BS.Col>
        <BS.Col sm=6>
          <Distractors termId={@props.id} />
        </BS.Col>
      </BS.Row>

      <BS.Row>
        <BS.Col sm=12>
          <h4>Tags</h4>
        </BS.Col>
      </BS.Row>
      <Tags vocabularyId={@props.id} />
    </div>


module.exports = Vocabulary
