React = require 'react'
BS = require 'react-bootstrap'
find = require 'lodash/find'
filter = require 'lodash/filter'
isEmpty = require 'lodash/isEmpty'
partial = require 'lodash/partial'
capitalize = require 'lodash/capitalize'

classnames = require 'classnames'

{NewCourseActions, NewCourseStore} = require '../../flux/new-course'
{CourseStore} = require '../../flux/course'
{OfferingsStore} = require '../../flux/offerings'
CourseInformation = require '../../flux/course-information'

MAX_SECTION_COUNT = 12

CourseDetails = React.createClass
  displayName: 'CourseDetails'
  statics:
    title: 'Name your course'

  componentWillMount: ->
    NewCourseActions.set({num_sections: 1}) unless NewCourseStore.get('num_sections')

    unless NewCourseStore.get('name')
      offeringId = NewCourseStore.get('offering_id')
      return unless offeringId

      term = NewCourseStore.get('term')
      {appearance_code} = OfferingsStore.get(offeringId)
      {title} = CourseInformation.forAppearanceCode(appearance_code)

      NewCourseActions.set('name': "#{title}, #{capitalize(term.term)} #{term.year}")

  updateName: (ev) ->
    NewCourseActions.set({name: ev.target.value})

  updateSectionCount: (ev) ->
    num_sections = Math.min(parseInt(ev.target.value, 10), MAX_SECTION_COUNT)
    NewCourseActions.set({num_sections})

  render: ->
    <BS.Form>
      <BS.FormGroup className='course-details-name'>
        <BS.FormControl autoFocus
          type="text"
          defaultValue={NewCourseStore.get('name') or ''}
          placeholder='Choose a name for your course'
          onChange={@updateName}
        />
      </BS.FormGroup>
      <BS.FormGroup className='course-details-sections'>
        <BS.InputGroup>
          <BS.InputGroup.Addon>Number of sections</BS.InputGroup.Addon>
          <BS.FormControl
            type='number'
            min='1' max={MAX_SECTION_COUNT}
            value={NewCourseStore.get('num_sections')}
            onChange={@updateSectionCount}
          />
        </BS.InputGroup>
        <p className='course-details-sections-note'>
          <small><i>(You can add or remove sections later)</i></small>
        </p>
      </BS.FormGroup>
    </BS.Form>

module.exports = CourseDetails
